/**
 * Mojo Compiler - x86-64 Assembly Generator
 * LLVM IR → x86-64 Assembly (Direct, no gcc dependency)
 *
 * Target: System V AMD64 ABI (Linux x86-64)
 * Syntax: AT&T (gas compatible)
 *
 * Calling Convention:
 *  - rdi, rsi, rdx, rcx, r8, r9 (integer arguments, left to right)
 *  - rax, rdx (return values)
 *  - rsp (stack pointer)
 *  - rbp (base pointer)
 */

class AssemblyGenerator {
  constructor() {
    this.output = [];
    this.functions = [];
    this.labelCounter = 0;
    this.stringTable = [];  // Global string constants
    this.dataSection = [];
    this.textSection = [];
  }

  /**
   * Generate x86-64 assembly from LLVM IR
   * @param {string} llvmIR - LLVM IR code
   * @returns {string} - x86-64 assembly
   */
  generate(llvmIR) {
    this.output = [];
    this.dataSection = [];
    this.textSection = [];
    this.stringTable = [];
    this.labelCounter = 0;

    // Parse LLVM IR to functions
    const functions = this.parseLLVMIR(llvmIR);

    // Generate assembly
    this.emitHeader();

    // Data section (global strings, constants)
    if (this.stringTable.length > 0) {
      this.emitDataSection();
    }

    // Text section (code)
    this.emitTextSection();

    // Generate all functions except main
    for (const func of functions) {
      if (func.name !== "_mojo_main" && func.name !== "main") {
        this.generateFunction(func);
      }
    }

    // Generate mojo main if it exists
    for (const func of functions) {
      if (func.name === "_mojo_main") {
        this.generateFunction(func);
        break;
      }
    }

    // Entry point: C main that calls mojo main
    const hasMojoMain = functions.some(f => f.name === "_mojo_main");
    this.emitEntryPoint(hasMojoMain);

    return this.output.join("\n");
  }

  /**
   * Parse LLVM IR to extract functions
   * @param {string} llvmIR - LLVM IR code
   * @returns {Array} - Function objects
   */
  parseLLVMIR(llvmIR) {
    const functions = [];
    const lines = llvmIR.split("\n");
    let currentFunc = null;
    let inFunction = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line || line.startsWith(";")) continue;

      // Match function definition
      const funcMatch = line.match(/define\s+(\S+)\s+@(\w+)\s*\((.*?)\)/);
      if (funcMatch) {
        if (currentFunc) functions.push(currentFunc);

        // Rename "main" to "_mojo_main"
        let funcName = funcMatch[2];
        if (funcName === "main") funcName = "_mojo_main";

        currentFunc = {
          name: funcName,
          returnType: funcMatch[1],
          params: this.parseParams(funcMatch[3]),
          body: [],
          instructions: []
        };
        inFunction = true;
        continue;
      }

      if (line === "}" && inFunction) {
        if (currentFunc) {
          functions.push(currentFunc);
          currentFunc = null;
        }
        inFunction = false;
        continue;
      }

      if (inFunction && currentFunc) {
        // Include labels (bb0:, bb1:, etc.) - they're needed for branch targets
        if (line !== "entry:") {
          currentFunc.instructions.push(line);
        }
      }
    }

    if (currentFunc) functions.push(currentFunc);
    return functions;
  }

  /**
   * Parse LLVM parameters
   * @param {string} paramStr - Parameter string like "i32 %a, i32 %b"
   * @returns {Array} - Parameter objects
   */
  parseParams(paramStr) {
    if (!paramStr.trim()) return [];

    return paramStr.split(",").map((p, index) => {
      const parts = p.trim().split(/\s+/);
      return {
        type: parts[0],
        name: parts[1].replace("%", ""),
        reg: this.getParamReg(index)  // rdi, rsi, rdx, rcx, r8, r9
      };
    });
  }

  /**
   * Get register for parameter by index (System V AMD64)
   * @param {number} index - Parameter index (0-5)
   * @returns {string} - Register name
   */
  getParamReg(index) {
    const regs = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"];
    return regs[index] || "stack";
  }

  /**
   * Generate assembly for a function
   * @param {Object} func - Function object
   */
  generateFunction(func) {
    const funcName = func.name;

    // Function prologue
    this.emit(`${funcName}:`);
    this.emit("  pushq %rbp");
    this.emit("  movq %rsp, %rbp");

    // Allocate local variables on stack
    const localVars = this.extractLocalVariables(func.instructions);
    const stackSize = Object.keys(localVars).length * 8;  // 8 bytes per variable
    if (stackSize > 0) {
      this.emit(`  subq $${stackSize}, %rsp`);
    }

    // Generate instructions
    const varMap = this.mapVariables(func.params, localVars);
    for (const instr of func.instructions) {
      this.generateInstruction(instr, varMap);
    }

    // Default return if missing
    if (!func.instructions.some(i => i.includes("ret"))) {
      if (func.returnType === "void") {
        this.emit("  xorq %rax, %rax");
      }
    }

    // Function epilogue
    this.emit("  movq %rbp, %rsp");
    this.emit("  popq %rbp");
    this.emit("  retq");
    this.emit("");
  }

  /**
   * Extract local variables from instructions
   * @param {Array} instructions - Instruction array
   * @returns {Object} - Variable map {name: type}
   */
  extractLocalVariables(instructions) {
    const vars = {};

    for (const instr of instructions) {
      // Match temporary variables: %t0, %t1, etc.
      const matches = instr.match(/%t\d+/g);
      if (matches) {
        for (const match of matches) {
          if (!vars[match.replace("%", "")]) {
            vars[match.replace("%", "")] = "i64";  // Default to 64-bit
          }
        }
      }
    }

    return vars;
  }

  /**
   * Map variables to memory locations
   * @param {Array} params - Parameters
   * @param {Object} localVars - Local variables
   * @returns {Object} - Variable location map
   */
  mapVariables(params, localVars) {
    const map = {};
    let stackOffset = -8;  // Start from -8 (locals go below rbp)

    // Map parameters to registers
    for (const param of params) {
      map[param.name] = {
        type: "reg",
        value: param.reg
      };
    }

    // Map local variables to stack
    for (const varName in localVars) {
      map[varName] = {
        type: "mem",
        offset: stackOffset
      };
      stackOffset -= 8;
    }

    return map;
  }

  /**
   * Generate assembly for a single instruction
   * @param {string} instr - LLVM instruction
   * @param {Object} varMap - Variable location map
   */
  generateInstruction(instr, varMap) {
    instr = instr.trim();

    if (!instr) return;

    // Comparison: %t0 = sdiv i64 %a, 1  (comparison treated as sdiv in LLVM IR)
    // Actually, comparisons come as: %t0 = icmp sle i64 %n, 1
    const cmpMatch = instr.match(/^(%\w+)\s*=\s*icmp\s+(\w+)\s+(\S+)\s+([^,]+),\s*(.+)$/);
    if (cmpMatch) {
      const [, result, predicate, type, left, right] = cmpMatch;
      const leftVal = this.getValue(left.trim(), varMap);
      const rightVal = this.getValue(right.trim(), varMap);

      // Generate comparison
      this.emit(`  cmpq ${rightVal}, ${leftVal}`);  // cmp right, left (Intel syntax-like)

      // Store result (1 if true, 0 if false) using setcc instruction
      const setccOp = this.mapSetCC(predicate);
      this.emit(`  ${setccOp} %al`);
      this.emit(`  movzbl %al, %eax`);  // Zero-extend to 64-bit
      this.emit(`  movq %rax, %r10`);   // Save to r10 (temp result register)

      // Store result to variable
      const resultLoc = varMap[result.replace("%", "")];
      if (resultLoc) {
        if (resultLoc.type === "mem") {
          this.emit(`  movq %r10, ${resultLoc.offset}(%rbp)`);
        }
      }
      return;
    }

    // Binary operation: %t0 = add i64 %a, %b
    const binOpMatch = instr.match(/^(%\w+)\s*=\s*(\w+)\s+(\S+)\s+([^,]+),\s*(.+)$/);
    if (binOpMatch) {
      const [, result, op, type, left, right] = binOpMatch;
      const leftVal = this.getValue(left.trim(), varMap);
      const rightVal = this.getValue(right.trim(), varMap);

      // mov left to rax
      this.emit(`  movq ${leftVal}, %rax`);

      // perform operation
      const asmOp = this.mapOp(op);
      this.emit(`  ${asmOp} ${rightVal}, %rax`);

      // store result
      const resultLoc = varMap[result.replace("%", "")];
      if (resultLoc) {
        if (resultLoc.type === "mem") {
          this.emit(`  movq %rax, ${resultLoc.offset}(%rbp)`);
        } else {
          this.emit(`  movq %rax, %${resultLoc.value}`);
        }
      }
      return;
    }

    // Return: ret i64 %t0
    const retMatch = instr.match(/^ret\s+(\S+)\s+(.+)$/);
    if (retMatch) {
      const [, type, value] = retMatch;
      const val = this.getValue(value.trim(), varMap);

      // Load return value into rax
      this.emit(`  movq ${val}, %rax`);
      // (epilogue will follow)
      return;
    }

    // Simple return void
    if (instr === "ret void") {
      this.emit("  xorq %rax, %rax");
      return;
    }

    // Function call: %t1 = call i64 @func(i64 %a, i64 %b)
    const callMatch = instr.match(/^(%?\w*)\s*=?\s*call\s+(\S+)\s+@(\w+)\s*\((.*?)\)$/);
    if (callMatch) {
      const [, result, returnType, funcName, argsStr] = callMatch;
      const args = argsStr ? argsStr.split(",").map(a => a.trim()) : [];

      // Move arguments to registers (System V ABI)
      const argRegs = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"];
      for (let i = 0; i < args.length; i++) {
        const argVal = this.getValue(args[i].split(/\s+/)[1] || args[i], varMap);
        this.emit(`  movq ${argVal}, %${argRegs[i]}`);
      }

      // Call function
      this.emit(`  callq ${funcName}`);

      // Store return value if needed
      if (result && result.startsWith("%")) {
        const resultLoc = varMap[result.replace("%", "")];
        if (resultLoc && resultLoc.type === "mem") {
          this.emit(`  movq %rax, ${resultLoc.offset}(%rbp)`);
        }
      }
      return;
    }

    // Labels: bb0:, bb1:, etc.
    if (instr.endsWith(":")) {
      this.emit(`.L${instr}`);  // Convert bb0: to .Lbb0:
      return;
    }

    // Conditional branch: br i1 %cond, label %bb0, label %bb1
    const brMatch = instr.match(/^br\s+i1\s+(%\w+),\s*label\s+%(\w+),\s*label\s+%(\w+)$/);
    if (brMatch) {
      const [, cond, trueLabel, falseLabel] = brMatch;
      const condName = cond.replace("%", "");
      const condLoc = varMap[condName];

      // Load condition and test
      if (condLoc) {
        if (condLoc.type === "mem") {
          this.emit(`  movq ${condLoc.offset}(%rbp), %r10`);
        } else {
          this.emit(`  movq %${condLoc.value}, %r10`);
        }
      } else {
        this.emit(`  movq %${condName}, %r10`);
      }

      // Test and branch
      this.emit(`  testq %r10, %r10`);
      this.emit(`  jnz .L${trueLabel}`);    // Jump if not zero (true)
      this.emit(`  jmp .L${falseLabel}`);   // Jump to false
      return;
    }

    // Unconditional branch: br label %bb2
    const brUncondMatch = instr.match(/^br\s+label\s+%(\w+)$/);
    if (brUncondMatch) {
      const [, label] = brUncondMatch;
      this.emit(`  jmp .L${label}`);
      return;
    }
  }

  /**
   * Get assembly value (register or immediate)
   * @param {string} val - Value (like "%a", "5", "%t0")
   * @param {Object} varMap - Variable location map
   * @returns {string} - Assembly operand
   */
  getValue(val, varMap) {
    val = val.trim().replace("%", "");

    // Check if it's a variable in map
    if (varMap[val]) {
      const loc = varMap[val];
      if (loc.type === "reg") {
        return `%${loc.value}`;
      } else {
        return `${loc.offset}(%rbp)`;
      }
    }

    // Numeric literal
    if (/^\d+$/.test(val)) {
      return `$${val}`;
    }

    // Unknown variable (fallback)
    return `%${val}`;
  }

  /**
   * Map LLVM operations to x86-64 instructions
   * @param {string} llvmOp - LLVM operation
   * @returns {string} - x86-64 instruction
   */
  mapOp(llvmOp) {
    const opMap = {
      "add": "addq",
      "sub": "subq",
      "mul": "imulq",
      "sdiv": "idivq",
      "and": "andq",
      "or": "orq",
      "xor": "xorq"
    };
    return opMap[llvmOp] || "addq";
  }

  /**
   * Map LLVM comparison predicates to x86-64 setcc instructions
   * @param {string} predicate - LLVM predicate (sle, eq, ne, slt, etc.)
   * @returns {string} - x86-64 setcc instruction
   */
  mapSetCC(predicate) {
    const setccMap = {
      "sle": "setle",   // signed less or equal
      "slt": "setl",    // signed less than
      "sge": "setge",   // signed greater or equal
      "sgt": "setg",    // signed greater than
      "eq": "sete",     // equal
      "ne": "setne"     // not equal
    };
    return setccMap[predicate] || "sete";
  }

  /**
   * Emit assembly header
   */
  emitHeader() {
    this.emit(".file \"<stdin>\"");
    this.emit(".text");
    this.emit(".globl main");
    this.emit("");
  }

  /**
   * Emit data section
   */
  emitDataSection() {
    this.emit(".data");
    for (const str of this.stringTable) {
      this.emit(`${str.label}:`);
      this.emit(`  .asciz "${str.value}"`);
    }
    this.emit("");
  }

  /**
   * Emit text section
   */
  emitTextSection() {
    this.emit(".text");
    this.emit("");
  }

  /**
   * Emit entry point (main wrapper)
   * @param {boolean} hasMojoMain - Whether mojo main exists
   */
  emitEntryPoint(hasMojoMain) {
    this.emit("main:");
    this.emit("  pushq %rbp");
    this.emit("  movq %rsp, %rbp");

    if (hasMojoMain) {
      this.emit("  callq _mojo_main");
    }

    this.emit("  xorq %rax, %rax");  // exit code 0
    this.emit("  movq %rbp, %rsp");
    this.emit("  popq %rbp");
    this.emit("  retq");
  }

  /**
   * Emit a line of assembly
   * @param {string} line - Assembly line
   */
  emit(line) {
    this.output.push(line);
  }

  /**
   * Allocate a label
   * @returns {string} - Unique label name
   */
  allocLabel() {
    return `.L${this.labelCounter++}`;
  }
}

module.exports = { AssemblyGenerator };
