/**
 * Mojo Compiler - MLIR IR Generator
 *
 * 역할: AST → MLIR lit 다이얼렉트 IR 생성
 *
 * MLIR Operation format:
 * %result = dialect.op %operand1, %operand2 : type -> resulttype
 *
 * Mojo 다이얼렉트 계층:
 * lit (High-level) → kgen (Mid-level) → llvm (Low-level)
 */

import * as AST from "./ast";

export interface MLIRValue {
  name: string;
  type: string;
}

export class MLIRGenerator {
  private output: string[] = [];
  private valueCounter: number = 0;
  private indentLevel: number = 0;

  public generate(program: AST.Program): string {
    this.output = [];
    this.valueCounter = 0;
    this.indentLevel = 0;

    // MLIR 모듈 헤더
    this.emit('module {');
    this.indent();

    // 함수 및 구조체 생성
    for (const item of program.items) {
      if (item.type === "FunctionDeclaration") {
        this.generateFunction(item as AST.FunctionDeclaration);
      } else if (item.type === "StructDeclaration") {
        this.generateStruct(item as AST.StructDeclaration);
      }
      this.emit("");
    }

    this.dedent();
    this.emit("}");

    return this.output.join("\n");
  }

  // ============= 함수 생성 =============

  private generateFunction(fn: AST.FunctionDeclaration): void {
    // 함수 시그니처
    let signature = `lit.func @${fn.name}(`;

    // 파라미터
    const paramSignatures = fn.parameters.map((param, idx) => {
      const ownership =
        param.ownership === "owned"
          ? "!"
          : param.ownership === "mut"
          ? "&"
          : "";
      return `%arg${idx}: ${ownership}${this.typeToMLIR(param.typeAnnotation)}`;
    });

    signature += paramSignatures.join(", ");
    signature += ")";

    // 반환 타입
    if (fn.returnType) {
      signature += ` -> ${this.typeToMLIR(fn.returnType)}`;
    }

    this.emit(signature + " {");
    this.indent();

    // 함수 바디
    for (const stmt of fn.body) {
      this.generateStatement(stmt);
    }

    // 기본 return (명시적 return이 없을 경우)
    if (fn.body.length === 0 || !this.isReturnStatement(fn.body[fn.body.length - 1])) {
      if (fn.returnType) {
        this.emit(`lit.return %0: ${this.typeToMLIR(fn.returnType)}`);
      } else {
        this.emit("lit.return");
      }
    }

    this.dedent();
    this.emit("}");
  }

  // ============= 구조체 생성 =============

  private generateStruct(struct: AST.StructDeclaration): void {
    this.emit(`lit.struct @${struct.name} {`);
    this.indent();

    for (const field of struct.fields) {
      const fieldType = this.typeToMLIR(field.typeAnnotation);
      this.emit(`"${field.name}": ${fieldType},`);
    }

    this.dedent();
    this.emit("}");
  }

  // ============= 명령문 생성 =============

  private generateStatement(stmt: AST.Statement): void {
    switch (stmt.type) {
      case "VariableDeclaration":
        this.generateVarDecl(stmt as AST.VariableDeclaration);
        break;

      case "Assignment":
        this.generateAssignment(stmt as AST.Assignment);
        break;

      case "ExpressionStatement":
        this.generateExpressionStmt(stmt as AST.ExpressionStatement);
        break;

      case "ReturnStatement":
        this.generateReturn(stmt as AST.ReturnStatement);
        break;

      case "ForLoop":
        this.generateForLoop(stmt as AST.ForLoop);
        break;

      case "WhileLoop":
        this.generateWhileLoop(stmt as AST.WhileLoop);
        break;
    }
  }

  private generateVarDecl(decl: AST.VariableDeclaration): void {
    if (decl.value) {
      const valName = this.newValue();
      const valType = this.inferExpressionType(decl.value);

      this.generateExpressionValue(decl.value, valName, valType);

      // 변수 할당
      const type = decl.typeAnnotation
        ? this.typeToMLIR(decl.typeAnnotation)
        : valType;

      this.emit(
        `%${decl.name} = lit.declare ${valName} : ${type}  ${
          decl.isMutable ? "mutable" : "immutable"
        }`
      );
    }
  }

  private generateAssignment(assign: AST.Assignment): void {
    const rhsName = this.newValue();
    const rhsType = this.inferExpressionType(assign.value);

    this.generateExpressionValue(assign.value, rhsName, rhsType);

    if (assign.target.type === "Identifier") {
      const ident = assign.target as AST.Identifier;
      this.emit(`%${ident.name} = lit.assign %${ident.name}, ${rhsName} : ${rhsType}`);
    }
  }

  private generateExpressionStmt(stmt: AST.ExpressionStatement): void {
    const valName = this.newValue();
    const valType = this.inferExpressionType(stmt.expression);
    this.generateExpressionValue(stmt.expression, valName, valType);
  }

  private generateReturn(ret: AST.ReturnStatement): void {
    if (ret.value) {
      const valName = this.newValue();
      const valType = this.inferExpressionType(ret.value);

      this.generateExpressionValue(ret.value, valName, valType);
      this.emit(`lit.return ${valName} : ${valType}`);
    } else {
      this.emit("lit.return");
    }
  }

  private generateForLoop(loop: AST.ForLoop): void {
    // range 표현식 처리
    const iterName = this.newValue();
    const iterType = this.inferExpressionType(loop.iterable);

    this.generateExpressionValue(loop.iterable, iterName, iterType);

    this.emit(`hlcf.loop(%${loop.variable} in ${iterName} : ${iterType}) {`);
    this.indent();

    for (const stmt of loop.body) {
      this.generateStatement(stmt);
    }

    this.dedent();
    this.emit("}");
  }

  private generateWhileLoop(loop: AST.WhileLoop): void {
    const condName = this.newValue();
    const condType = this.inferExpressionType(loop.condition);

    this.generateExpressionValue(loop.condition, condName, condType);

    this.emit(`hlcf.while ${condName} : ${condType} {`);
    this.indent();

    for (const stmt of loop.body) {
      this.generateStatement(stmt);
    }

    this.dedent();
    this.emit("}");
  }

  // ============= 표현식 생성 =============

  private generateExpressionValue(
    expr: AST.Expression,
    destName: string,
    type: string
  ): void {
    switch (expr.type) {
      case "IntLiteral": {
        const lit = expr as AST.IntLiteral;
        this.emit(`${destName} = lit.constant ${lit.value} : ${type}`);
        break;
      }

      case "FloatLiteral": {
        const lit = expr as AST.FloatLiteral;
        this.emit(`${destName} = lit.constant ${lit.value} : ${type}`);
        break;
      }

      case "StringLiteral": {
        const lit = expr as AST.StringLiteral;
        this.emit(`${destName} = lit.constant "${lit.value}" : ${type}`);
        break;
      }

      case "BoolLiteral": {
        const lit = expr as AST.BoolLiteral;
        this.emit(
          `${destName} = lit.constant ${lit.value ? "true" : "false"} : ${type}`
        );
        break;
      }

      case "Identifier": {
        const ident = expr as AST.Identifier;
        this.emit(`${destName} = lit.var %${ident.name} : ${type}`);
        break;
      }

      case "BinaryOp": {
        const binOp = expr as AST.BinaryOp;
        const lhsName = this.newValue();
        const rhsName = this.newValue();
        const lhsType = this.inferExpressionType(binOp.left);
        const rhsType = this.inferExpressionType(binOp.right);

        this.generateExpressionValue(binOp.left, lhsName, lhsType);
        this.generateExpressionValue(binOp.right, rhsName, rhsType);

        const mlirOp = this.operatorToMLIROp(binOp.operator);
        this.emit(
          `${destName} = pop.${mlirOp} ${lhsName}, ${rhsName} : ${lhsType} -> ${type}`
        );
        break;
      }

      case "Call": {
        const call = expr as AST.Call;
        if (call.function.type === "Identifier") {
          const funcName = (call.function as AST.Identifier).name;
          const argNames: string[] = [];

          for (const arg of call.arguments) {
            const argName = this.newValue();
            const argType = this.inferExpressionType(arg);
            this.generateExpressionValue(arg, argName, argType);
            argNames.push(argName);
          }

          this.emit(
            `${destName} = lit.call @${funcName}(${argNames.join(", ")}) : () -> ${type}`
          );
        }
        break;
      }

      case "ArrayLiteral": {
        const arr = expr as AST.ArrayLiteral;
        const elemNames: string[] = [];

        for (const elem of arr.elements) {
          const elemName = this.newValue();
          const elemType = this.inferExpressionType(elem);
          this.generateExpressionValue(elem, elemName, elemType);
          elemNames.push(elemName);
        }

        this.emit(
          `${destName} = lit.array [${elemNames.join(", ")}] : ${type}`
        );
        break;
      }
    }
  }

  // ============= 타입 변환 =============

  private typeToMLIR(ta: AST.TypeAnnotation): string {
    if (ta.isParametric && ta.parameters) {
      const params = ta.parameters
        .map(p => (typeof p === "string" ? p : p.name))
        .join(", ");
      return `!${ta.name}<${params}>`;
    }
    return `!${ta.name}`;
  }

  private inferExpressionType(expr: AST.Expression): string {
    switch (expr.type) {
      case "IntLiteral":
        return "!i64";

      case "FloatLiteral":
        return "!f64";

      case "StringLiteral":
        return "!string";

      case "BoolLiteral":
        return "!bool";

      case "Identifier": {
        const ident = expr as AST.Identifier;
        // 정적 분석에서는 변수 타입을 알 수 없으므로 기본값 반환
        return "!unknown";
      }

      case "ArrayLiteral": {
        const arr = expr as AST.ArrayLiteral;
        if (arr.elements.length > 0) {
          const elemType = this.inferExpressionType(arr.elements[0]);
          return `!array<${elemType}>`;
        }
        return "!array<unknown>";
      }

      case "BinaryOp": {
        const binOp = expr as AST.BinaryOp;
        if (["+", "-", "*", "/", "%"].includes(binOp.operator)) {
          return this.inferExpressionType(binOp.left);
        } else if (
          ["==", "!=", "<", ">", "<=", ">=", "&&", "||"].includes(
            binOp.operator
          )
        ) {
          return "!bool";
        }
        return "!unknown";
      }

      case "Call": {
        const call = expr as AST.Call;
        if (call.function.type === "Identifier") {
          const funcName = (call.function as AST.Identifier).name;
          // 내장 함수의 반환 타입
          if (funcName === "len") return "!i64";
          if (funcName === "range") return "!iterator<i64>";
        }
        return "!unknown";
      }

      default:
        return "!unknown";
    }
  }

  // ============= 연산자 변환 =============

  private operatorToMLIROp(op: string): string {
    const opMap: { [key: string]: string } = {
      "+": "add",
      "-": "sub",
      "*": "mul",
      "/": "div",
      "%": "mod",
      "==": "eq",
      "!=": "ne",
      "<": "lt",
      ">": "gt",
      "<=": "le",
      ">=": "ge",
      "&&": "and",
      "||": "or",
    };

    return opMap[op] || "unknown";
  }

  // ============= 헬퍼 함수 =============

  private newValue(): string {
    return `%${this.valueCounter++}`;
  }

  private emit(line: string): void {
    this.output.push("  ".repeat(this.indentLevel) + line);
  }

  private indent(): void {
    this.indentLevel++;
  }

  private dedent(): void {
    this.indentLevel--;
  }

  private isReturnStatement(stmt: AST.Statement): boolean {
    return stmt.type === "ReturnStatement";
  }
}
