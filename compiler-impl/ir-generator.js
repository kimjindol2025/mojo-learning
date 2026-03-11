/**
 * Mojo Compiler - IR Generator
 * AST → LLVM Intermediate Representation
 */

class IRGenerator {
  constructor() {
    this.functions = [];
    this.currentFunction = null;
    this.blockCounter = 0;
    this.varCounter = 0;
    this.instructions = [];
  }

  // Generate LLVM IR from AST
  generate(program) {
    this.functions = [];

    // Process all function declarations
    for (const item of program.items) {
      if (item.type === "FunctionDeclaration") {
        this.generateFunction(item);
      }
    }

    return this.toLLVMIR();
  }

  generateFunction(func) {
    this.currentFunction = {
      name: func.name,
      params: func.parameters,
      returnType: func.returnType || "void",
      instructions: [],
      blockCounter: 0,
    };

    // Map parameter types to LLVM types
    const llvmParams = func.parameters
      .map(p => `${this.getTypeLLVM(p.type)} %${p.name}`)
      .join(", ");

    // Start function definition
    const returnTypeLLVM = this.getTypeLLVM(func.returnType || "void");
    this.currentFunction.signature = `define ${returnTypeLLVM} @${func.name}(${llvmParams})`;

    // Process function body
    this.emit("entry:");
    for (const stmt of func.body) {
      this.generateStatement(stmt);
    }

    // If no explicit return, add default
    if (func.returnType === "void" || func.returnType === undefined) {
      this.emit("ret void");
    }

    this.currentFunction.instructions = this.instructions;
    this.functions.push(this.currentFunction);
    this.instructions = [];
  }

  generateStatement(stmt) {
    if (!stmt) return;

    switch (stmt.type) {
      case "ReturnStatement":
        this.generateReturn(stmt);
        break;
      case "VariableDeclaration":
        this.generateVarDecl(stmt);
        break;
      case "ExpressionStatement":
        this.generateExpression(stmt.expression);
        break;
      case "IfStatement":
        this.generateIf(stmt);
        break;
    }
  }

  generateReturn(stmt) {
    if (!stmt.value) {
      this.emit("ret void");
      return;
    }

    const result = this.generateExpression(stmt.value);
    this.emit(`ret ${result.type} ${result.value}`);
  }

  generateVarDecl(decl) {
    if (decl.value) {
      const result = this.generateExpression(decl.value);
      const typeLLVM = this.getTypeLLVM(decl.typeAnnotation || "auto");
      const varName = this.freshVar();
      this.emit(`${varName} = alloca ${typeLLVM}`);
      this.emit(`store ${result.type} ${result.value}, ${typeLLVM}* ${varName}`);
      return { type: `${typeLLVM}*`, value: varName };
    }
  }

  generateExpression(expr) {
    if (!expr) return { type: "void", value: "undef" };

    switch (expr.type) {
      case "IntLiteral":
        return { type: "i32", value: String(expr.value) };

      case "FloatLiteral":
        return { type: "double", value: String(expr.value) };

      case "StringLiteral":
        // String literals as global variables (simplified)
        const strVar = `@str${this.varCounter++}`;
        return { type: "i8*", value: strVar };

      case "Identifier":
        return { type: "i32", value: `%${expr.name}` };

      case "BinaryOp":
        return this.generateBinaryOp(expr);

      case "Call":
        return this.generateCall(expr);

      default:
        return { type: "i32", value: "0" };
    }
  }

  generateBinaryOp(expr) {
    const left = this.generateExpression(expr.left);
    const right = this.generateExpression(expr.right);

    const opMap = {
      "+": "add",
      "-": "sub",
      "*": "mul",
      "/": "sdiv",
      "%": "srem",
    };

    const llvmOp = opMap[expr.operator] || "add";
    const result = this.freshVar();
    this.emit(`${result} = ${llvmOp} ${left.type} ${left.value}, ${right.value}`);
    return { type: left.type, value: result };
  }

  generateCall(expr) {
    const funcName = expr.function.name || expr.function;
    const args = expr.arguments
      .map(arg => {
        const result = this.generateExpression(arg);
        return `${result.type} ${result.value}`;
      })
      .join(", ");

    // Determine return type (simplified - assume i32)
    const result = this.freshVar();
    this.emit(`${result} = call i32 @${funcName}(${args})`);
    return { type: "i32", value: result };
  }

  generateIf(stmt) {
    const condition = this.generateExpression(stmt.condition);
    const trueBlock = `bb${this.currentFunction.blockCounter++}`;
    const falseBlock = `bb${this.currentFunction.blockCounter++}`;
    const endBlock = `bb${this.currentFunction.blockCounter++}`;

    this.emit(`br i1 ${condition.value}, label %${trueBlock}, label %${falseBlock}`);

    // True block
    this.emit(`${trueBlock}:`);
    for (const s of stmt.thenBranch) {
      this.generateStatement(s);
    }
    this.emit(`br label %${endBlock}`);

    // False block
    this.emit(`${falseBlock}:`);
    if (stmt.elseBranch) {
      for (const s of stmt.elseBranch) {
        this.generateStatement(s);
      }
    }
    this.emit(`br label %${endBlock}`);

    // End block
    this.emit(`${endBlock}:`);
  }

  emit(instruction) {
    this.instructions.push(instruction);
  }

  freshVar() {
    return `%t${this.varCounter++}`;
  }

  getTypeLLVM(mojoType) {
    const typeMap = {
      Int: "i32",
      Float: "double",
      String: "i8*",
      Bool: "i1",
      void: "void",
      auto: "i32", // Default to i32
    };
    return typeMap[mojoType] || "i32";
  }

  toLLVMIR() {
    let output = "; LLVM IR generated by Mojo Compiler\n";
    output += "; Module definition\n\n";

    // Emit all functions
    for (const func of this.functions) {
      output += `${func.signature} {\n`;
      for (const instr of func.instructions) {
        if (instr.endsWith(":")) {
          output += `${instr}\n`;
        } else {
          output += `  ${instr}\n`;
        }
      }
      output += `}\n\n`;
    }

    return output;
  }
}

module.exports = { IRGenerator };
