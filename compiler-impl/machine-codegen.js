/**
 * Mojo Compiler - Machine Code Generator
 * LLVM IR → C Code (Portable, compilable with gcc)
 *
 * Strategy: Convert LLVM IR to C code, then compile with gcc
 * This avoids dependency on llc while producing native executables
 */

class MachineCodeGenerator {
  constructor() {
    this.output = [];
    this.indentLevel = 0;
    this.functionMap = {};  // Track function signatures
  }

  /**
   * Generate C code from LLVM IR representation
   * @param {string} llvmIR - LLVM IR code
   * @returns {string} - C code
   */
  generate(llvmIR) {
    this.output = [];
    this.indentLevel = 0;
    this.functionMap = {};

    // Parse LLVM IR to extract functions
    const functions = this.parseLLVMIR(llvmIR);

    // Emit C header
    this.emit("#include <stdio.h>");
    this.emit("#include <stdlib.h>");
    this.emit("#include <stdint.h>");
    this.emit("");

    // Forward declarations
    for (const func of functions) {
      // Rename main to _mojo_main
      const fname = func.name === "main" ? "_mojo_main" : func.name;
      const signature = this.getCSignature({ ...func, name: fname });
      this.emit(`${signature};`);
    }
    this.emit("");

    // Function implementations
    for (const func of functions) {
      // Rename Mojo main() to _mojo_main() to avoid conflict
      if (func.name === "main") {
        func.name = "_mojo_main";
      }
      this.generateFunction(func);
      this.emit("");
    }

    // Main wrapper
    this.emit("int main(int argc, char* argv[]) {");
    this.indent();
    this.emit("_mojo_main();");
    this.emit("return 0;");
    this.dedent();
    this.emit("}")

    return this.output.join("\n");
  }

  /**
   * Parse LLVM IR text to extract function definitions
   * @param {string} llvmIR - LLVM IR code
   * @returns {Array} - Array of function objects
   */
  parseLLVMIR(llvmIR) {
    const functions = [];
    const lines = llvmIR.split("\n");
    let currentFunc = null;
    let inFunction = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip comments and empty lines
      if (!line || line.startsWith(";")) continue;

      // Match function definition: define <returnType> @<name>(<params>)
      const funcMatch = line.match(/define\s+(\S+)\s+@(\w+)\s*\((.*?)\)/);
      if (funcMatch) {
        if (currentFunc) {
          functions.push(currentFunc);
        }
        currentFunc = {
          name: funcMatch[2],
          returnType: funcMatch[1],
          params: this.parseParams(funcMatch[3]),
          body: [],
          instructions: []
        };
        inFunction = true;
        continue;
      }

      // Match closing brace
      if (line === "}" && inFunction) {
        if (currentFunc) {
          functions.push(currentFunc);
          currentFunc = null;
        }
        inFunction = false;
        continue;
      }

      // Collect instructions in function body
      if (inFunction && currentFunc) {
        if (!line.endsWith(":") && line !== "entry:") {
          currentFunc.instructions.push(line);
        }
      }
    }

    if (currentFunc) {
      functions.push(currentFunc);
    }

    return functions;
  }

  /**
   * Parse LLVM parameter list
   * @param {string} paramStr - Parameter string like "i32 %a, i32 %b"
   * @returns {Array} - Array of {type, name} objects
   */
  parseParams(paramStr) {
    if (!paramStr.trim()) return [];

    return paramStr.split(",").map(p => {
      const [type, name] = p.trim().split(/\s+/);
      return { type: this.llvmToCType(type), name: name.replace("%", "") };
    });
  }

  /**
   * Generate C function from LLVM function representation
   * @param {Object} func - Function object from parseLLVMIR
   */
  generateFunction(func) {
    const signature = this.getCSignature(func);
    this.emit(`${signature} {`);
    this.indent();

    // Generate local variable declarations
    const varDecls = this.extractVariableDeclarations(func.instructions);
    for (const [varName, type] of Object.entries(varDecls)) {
      this.emit(`${type} ${varName} = 0;`);
    }
    if (Object.keys(varDecls).length > 0) {
      this.emit("");
    }

    // Generate instruction translations
    for (const instr of func.instructions) {
      this.generateInstruction(instr);
    }

    // Default return if missing
    if (func.returnType === "void") {
      this.emit("return;");
    } else {
      this.emit(`return 0;  // Default return for ${func.returnType}`);
    }

    this.dedent();
    this.emit("}");
  }

  /**
   * Generate C code for a single LLVM instruction
   * @param {string} instr - LLVM instruction line
   */
  generateInstruction(instr) {
    instr = instr.trim();

    // Skip labels and empty lines
    if (instr.endsWith(":") || !instr) return;

    // Binary operation: %t0 = add i32 %a, %b
    const binOpMatch = instr.match(/^(%\w+)\s*=\s*(\w+)\s+(\S+)\s+([^,]+),\s*(.+)$/);
    if (binOpMatch) {
      const [, result, op, type, left, right] = binOpMatch;
      const cOp = this.mapLLVMOpToC(op);
      const leftVal = left.replace("%", "").trim();
      const rightVal = right.trim().replace("%", "");
      const varName = result.replace("%", "");
      this.emit(`${varName} = ${leftVal} ${cOp} ${rightVal};`);
      return;
    }

    // Allocation: %t0 = alloca i32
    const allocMatch = instr.match(/^(%\w+)\s*=\s*alloca\s+(.+)$/);
    if (allocMatch) {
      // Skip - handled by variable declarations
      return;
    }

    // Store: store i32 5, i32* %x
    const storeMatch = instr.match(/^store\s+(\S+)\s+(.+?),\s+(\S+)\s+\*?(%\w+)$/);
    if (storeMatch) {
      const [, type, value, , target] = storeMatch;
      const targetName = target.replace("%", "");
      const valueName = value.replace("%", "");
      this.emit(`${targetName} = ${valueName};`);
      return;
    }

    // Function call: %t1 = call i32 @add(i32 %a, i32 %b)
    const callMatch = instr.match(/^(%?\w*)\s*=?\s*call\s+(\S+)\s+@(\w+)\((.*?)\)$/);
    if (callMatch) {
      const [, result, returnType, funcName, argsStr] = callMatch;
      const args = argsStr ? argsStr.split(",").map(a => {
        const arg = a.trim();
        return arg.replace(/^\S+\s+/, "").replace("%", "");
      }).join(", ") : "";

      if (result && result.startsWith("%")) {
        const varName = result.replace("%", "");
        this.emit(`${varName} = ${funcName}(${args});`);
      } else {
        this.emit(`${funcName}(${args});`);
      }
      return;
    }

    // Return with value: ret i32 %t0
    const retValMatch = instr.match(/^ret\s+(\S+)\s+(.+)$/);
    if (retValMatch) {
      const [, type, value] = retValMatch;
      const val = value.replace("%", "").trim();
      this.emit(`return ${val};`);
      return;
    }

    // Return void: ret void
    if (instr === "ret void") {
      this.emit("return;");
      return;
    }

    // Branch: br i1 %cond, label %bb0, label %bb1
    const brMatch = instr.match(/^br\s+i1\s+(%\w+),\s*label\s+%(\w+),\s*label\s+%(\w+)$/);
    if (brMatch) {
      const [, cond, trueLabel, falseLabel] = brMatch;
      const condName = cond.replace("%", "");
      this.emit(`// Conditional branch: if (${condName}) goto ${trueLabel}; else goto ${falseLabel};`);
      return;
    }

    // Unconditional branch: br label %bb2
    const brUncondMatch = instr.match(/^br\s+label\s+%(\w+)$/);
    if (brUncondMatch) {
      const [, label] = brUncondMatch;
      this.emit(`// Branch: goto ${label};`);
      return;
    }

    // Catch-all for unhandled instructions
    this.emit(`// LLVM: ${instr}`);
  }

  /**
   * Extract variable declarations from instructions
   * @param {Array} instructions - Array of instruction strings
   * @returns {Object} - Map of {varName: type}
   */
  extractVariableDeclarations(instructions) {
    const vars = {};

    for (const instr of instructions) {
      // Variables assigned from operations: %t0 = add/sub/mul/div
      const assignMatch = instr.match(/^(%\w+)\s*=\s*(\w+)\s+(\S+)/);
      if (assignMatch) {
        const [, varName, op, type] = assignMatch;
        const cType = this.llvmToCType(type);
        vars[varName.replace("%", "")] = cType;
      }

      // Variables from function calls: %t1 = call i32 @func(...)
      const callMatch = instr.match(/^(%\w+)\s*=\s*call\s+(\S+)/);
      if (callMatch) {
        const [, varName, returnType] = callMatch;
        const cType = this.llvmToCType(returnType);
        vars[varName.replace("%", "")] = cType;
      }

      // Allocated variables: %x = alloca i32
      const allocMatch = instr.match(/^(%\w+)\s*=\s*alloca\s+(\S+)$/);
      if (allocMatch) {
        const [, varName, type] = allocMatch;
        const cType = this.llvmToCType(type);
        // Pointer type for allocated variables
        vars[varName.replace("%", "")] = `${cType}*`;
      }
    }

    return vars;
  }

  /**
   * Get C function signature from LLVM function
   * @param {Object} func - Function object
   * @returns {string} - C signature like "int add(int a, int b)"
   */
  getCSignature(func) {
    const returnType = this.llvmToCType(func.returnType);
    const params = func.params
      .map(p => `${p.type} ${p.name}`)
      .join(", ");
    return `${returnType} ${func.name}(${params || "void"})`;
  }

  /**
   * Map LLVM type to C type
   * @param {string} llvmType - LLVM type like "i32", "double", "i8*"
   * @returns {string} - C type like "int32_t", "double", "char*"
   */
  llvmToCType(llvmType) {
    const typeMap = {
      "void": "void",
      "i1": "int",
      "i8": "char",
      "i16": "short",
      "i32": "int32_t",
      "i64": "int64_t",
      "double": "double",
      "float": "float",
      "i8*": "char*",
      "i32*": "int32_t*"
    };
    return typeMap[llvmType] || "int";
  }

  /**
   * Map LLVM operation to C operator
   * @param {string} llvmOp - LLVM op like "add", "sub", "mul"
   * @returns {string} - C operator like "+", "-", "*"
   */
  mapLLVMOpToC(llvmOp) {
    const opMap = {
      "add": "+",
      "sub": "-",
      "mul": "*",
      "sdiv": "/",
      "udiv": "/",
      "srem": "%",
      "urem": "%",
      "and": "&",
      "or": "|",
      "xor": "^"
    };
    return opMap[llvmOp] || "+";
  }

  emit(line) {
    if (line === "") {
      this.output.push("");
    } else {
      this.output.push("  ".repeat(this.indentLevel) + line);
    }
  }

  indent() {
    this.indentLevel++;
  }

  dedent() {
    this.indentLevel = Math.max(0, this.indentLevel - 1);
  }
}

module.exports = { MachineCodeGenerator };
