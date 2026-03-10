/**
 * Mojo Compiler - Type Checker & Ownership Verifier
 *
 * 역할: AST에서 타입 검사 및 소유권 검증
 *
 * Mojo의 3단계 타입 체킹:
 * 1. Context-Insensitive Type Checker (owned/borrowed/mut 분류)
 * 2. Lifetime Checker (라이프타임 추적)
 * 3. Drop Insertion (자동 정리)
 */

import * as AST from "./ast";

export interface TypeInfo {
  name: string;
  isParametric: boolean;
  parameters?: string[];
}

export interface ValueInfo {
  name: string;
  type: TypeInfo;
  ownership: "owned" | "borrowed" | "mut";
  mutable: boolean;
  initialized: boolean;
  line: number;
  column: number;
}

export interface SymbolTable {
  values: Map<string, ValueInfo>;
  functions: Map<string, FunctionInfo>;
  structs: Map<string, StructInfo>;
  parent?: SymbolTable;
}

export interface FunctionInfo {
  name: string;
  parameters: ValueInfo[];
  returnType?: TypeInfo;
  line: number;
  column: number;
}

export interface StructInfo {
  name: string;
  fields: Map<string, TypeInfo>;
  line: number;
  column: number;
}

export interface CheckError {
  message: string;
  line: number;
  column: number;
  code: string;
}

export class TypeChecker {
  private globalSymbols: SymbolTable;
  private currentSymbols: SymbolTable;
  private errors: CheckError[] = [];
  private warnings: string[] = [];

  constructor() {
    this.globalSymbols = {
      values: new Map(),
      functions: new Map(),
      structs: new Map(),
    };
    this.currentSymbols = this.globalSymbols;

    // 기본 타입 및 함수 등록
    this.registerBuiltins();
  }

  private registerBuiltins(): void {
    // 내장 함수 등록
    this.globalSymbols.functions.set("print", {
      name: "print",
      parameters: [
        {
          name: "value",
          type: { name: "String", isParametric: false },
          ownership: "borrowed",
          mutable: false,
          initialized: true,
          line: 0,
          column: 0,
        },
      ],
      returnType: undefined,
      line: 0,
      column: 0,
    });

    this.globalSymbols.functions.set("len", {
      name: "len",
      parameters: [
        {
          name: "value",
          type: { name: "Any", isParametric: false },
          ownership: "borrowed",
          mutable: false,
          initialized: true,
          line: 0,
          column: 0,
        },
      ],
      returnType: { name: "Int", isParametric: false },
      line: 0,
      column: 0,
    });

    this.globalSymbols.functions.set("str", {
      name: "str",
      parameters: [
        {
          name: "value",
          type: { name: "Any", isParametric: false },
          ownership: "borrowed",
          mutable: false,
          initialized: true,
          line: 0,
          column: 0,
        },
      ],
      returnType: { name: "String", isParametric: false },
      line: 0,
      column: 0,
    });

    this.globalSymbols.functions.set("range", {
      name: "range",
      parameters: [
        {
          name: "start",
          type: { name: "Int", isParametric: false },
          ownership: "borrowed",
          mutable: false,
          initialized: true,
          line: 0,
          column: 0,
        },
        {
          name: "end",
          type: { name: "Int", isParametric: false },
          ownership: "borrowed",
          mutable: false,
          initialized: true,
          line: 0,
          column: 0,
        },
      ],
      returnType: { name: "Iterator", isParametric: true, parameters: ["Int"] },
      line: 0,
      column: 0,
    });
  }

  public check(program: AST.Program): {
    program: AST.Program;
    errors: CheckError[];
    warnings: string[];
  } {
    // 1단계: 함수와 구조체 등록
    this.registerDeclarations(program);

    // 2단계: 함수 바디 검사
    for (const item of program.items) {
      if (item.type === "FunctionDeclaration") {
        this.checkFunction(item);
      }
    }

    return {
      program,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  // ============= 선언 등록 =============

  private registerDeclarations(program: AST.Program): void {
    for (const item of program.items) {
      if (item.type === "FunctionDeclaration") {
        const paramInfos: ValueInfo[] = item.parameters.map(param => ({
          name: param.name,
          type: this.typeAnnotationToInfo(param.typeAnnotation),
          ownership: param.ownership,
          mutable: param.ownership === "mut",
          initialized: true,
          line: param.line,
          column: param.column,
        }));

        this.globalSymbols.functions.set(item.name, {
          name: item.name,
          parameters: paramInfos,
          returnType: item.returnType
            ? this.typeAnnotationToInfo(item.returnType)
            : undefined,
          line: item.line,
          column: item.column,
        });
      } else if (item.type === "StructDeclaration") {
        const fields = new Map<string, TypeInfo>();
        for (const field of item.fields) {
          fields.set(field.name, this.typeAnnotationToInfo(field.typeAnnotation));
        }

        this.globalSymbols.structs.set(item.name, {
          name: item.name,
          fields,
          line: item.line,
          column: item.column,
        });
      }
    }
  }

  // ============= 함수 검사 =============

  private checkFunction(fn: AST.FunctionDeclaration): void {
    // 새 스코프 생성
    const parentSymbols = this.currentSymbols;
    this.currentSymbols = {
      values: new Map(),
      functions: this.globalSymbols.functions,
      structs: this.globalSymbols.structs,
      parent: parentSymbols,
    };

    // 파라미터를 심볼 테이블에 등록
    for (const param of fn.parameters) {
      this.currentSymbols.values.set(param.name, {
        name: param.name,
        type: this.typeAnnotationToInfo(param.typeAnnotation),
        ownership: param.ownership,
        mutable: param.ownership === "mut",
        initialized: true,
        line: param.line,
        column: param.column,
      });
    }

    // 바디 검사
    for (const stmt of fn.body) {
      this.checkStatement(stmt);
    }

    // 스코프 종료 — 모든 소유된 값이 정리되는지 확인
    for (const [name, value] of this.currentSymbols.values) {
      if (value.ownership === "owned" && value.initialized) {
        // Drop 호출이 필요함을 기록 (실제로는 IR에서 drop 삽입)
      }
    }

    // 스코프 복원
    this.currentSymbols = parentSymbols;
  }

  // ============= 명령문 검사 =============

  private checkStatement(stmt: AST.Statement): void {
    switch (stmt.type) {
      case "VariableDeclaration":
        this.checkVariableDeclaration(stmt as AST.VariableDeclaration);
        break;

      case "Assignment":
        this.checkAssignment(stmt as AST.Assignment);
        break;

      case "ExpressionStatement":
        this.checkExpression((stmt as AST.ExpressionStatement).expression);
        break;

      case "ReturnStatement":
        this.checkReturn(stmt as AST.ReturnStatement);
        break;

      case "ForLoop":
        this.checkForLoop(stmt as AST.ForLoop);
        break;

      case "WhileLoop":
        this.checkWhileLoop(stmt as AST.WhileLoop);
        break;
    }
  }

  private checkVariableDeclaration(decl: AST.VariableDeclaration): void {
    // 이미 선언된 변수 확인
    if (this.currentSymbols.values.has(decl.name)) {
      this.error(
        `Variable '${decl.name}' already declared`,
        decl.line,
        decl.column,
        "DUPLICATE_VAR"
      );
      return;
    }

    let type: TypeInfo;
    if (decl.typeAnnotation) {
      type = this.typeAnnotationToInfo(decl.typeAnnotation);
    } else if (decl.value) {
      // 타입 추론
      type = this.inferType(decl.value);
    } else {
      this.error(
        "Variable must have explicit type or initializer",
        decl.line,
        decl.column,
        "MISSING_TYPE"
      );
      return;
    }

    // 변수를 심볼 테이블에 등록
    this.currentSymbols.values.set(decl.name, {
      name: decl.name,
      type,
      ownership: "owned",
      mutable: decl.isMutable,
      initialized: !!decl.value,
      line: decl.line,
      column: decl.column,
    });

    // 초기화 값 검사
    if (decl.value) {
      this.checkExpression(decl.value);
    }
  }

  private checkAssignment(assign: AST.Assignment): void {
    // 왼쪽 사이드 검사 (할당 대상)
    if (assign.target.type === "Identifier") {
      const ident = assign.target as AST.Identifier;
      const value = this.lookup(ident.name);

      if (!value) {
        this.error(
          `Undefined variable '${ident.name}'`,
          assign.line,
          assign.column,
          "UNDEFINED_VAR"
        );
        return;
      }

      // let으로 선언된 변수에 할당할 수 없음
      if (!value.mutable) {
        this.error(
          `Cannot assign to immutable variable '${ident.name}'`,
          assign.line,
          assign.column,
          "IMMUTABLE_VAR"
        );
        return;
      }

      // 소유권이 owned이어야 함
      if (value.ownership !== "owned" && value.ownership !== "mut") {
        this.error(
          `Cannot assign to borrowed variable '${ident.name}'`,
          assign.line,
          assign.column,
          "BORROW_CONFLICT"
        );
        return;
      }
    }

    // 오른쪽 사이드 검사 (할당 값)
    this.checkExpression(assign.value);
  }

  private checkForLoop(loop: AST.ForLoop): void {
    // 루프 변수 타입 추론
    const iterType = this.inferType(loop.iterable);

    // 새 루프 스코프
    const parentSymbols = this.currentSymbols;
    this.currentSymbols = {
      values: new Map(parentSymbols.values),
      functions: parentSymbols.functions,
      structs: parentSymbols.structs,
      parent: parentSymbols,
    };

    // 루프 변수 등록
    this.currentSymbols.values.set(loop.variable, {
      name: loop.variable,
      type: this.getElementType(iterType),
      ownership: "borrowed",
      mutable: false,
      initialized: true,
      line: loop.line,
      column: loop.column,
    });

    // 바디 검사
    for (const stmt of loop.body) {
      this.checkStatement(stmt);
    }

    // 스코프 복원
    this.currentSymbols = parentSymbols;
  }

  private checkWhileLoop(loop: AST.WhileLoop): void {
    // 조건 검사
    const condType = this.inferType(loop.condition);

    // 불린 타입 확인
    if (condType.name !== "Bool") {
      this.warning(
        `While condition should be Bool, got ${condType.name}`,
        loop.line,
        loop.column
      );
    }

    // 바디 검사
    for (const stmt of loop.body) {
      this.checkStatement(stmt);
    }
  }

  private checkReturn(ret: AST.ReturnStatement): void {
    if (ret.value) {
      this.checkExpression(ret.value);
    }
  }

  // ============= 표현식 검사 =============

  private checkExpression(expr: AST.Expression): TypeInfo {
    switch (expr.type) {
      case "IntLiteral":
        return { name: "Int", isParametric: false };

      case "FloatLiteral":
        return { name: "Float", isParametric: false };

      case "StringLiteral":
        return { name: "String", isParametric: false };

      case "BoolLiteral":
        return { name: "Bool", isParametric: false };

      case "Identifier": {
        const ident = expr as AST.Identifier;
        const value = this.lookup(ident.name);

        if (!value) {
          this.error(
            `Undefined variable '${ident.name}'`,
            expr.line,
            expr.column,
            "UNDEFINED_VAR"
          );
          return { name: "Unknown", isParametric: false };
        }

        return value.type;
      }

      case "BinaryOp":
        return this.checkBinaryOp(expr as AST.BinaryOp);

      case "UnaryOp":
        return this.checkUnaryOp(expr as AST.UnaryOp);

      case "Call":
        return this.checkCall(expr as AST.Call);

      case "FieldAccess":
        return this.checkFieldAccess(expr as AST.FieldAccess);

      case "IndexAccess":
        return this.checkIndexAccess(expr as AST.IndexAccess);

      case "ArrayLiteral":
        return this.checkArrayLiteral(expr as AST.ArrayLiteral);

      case "IfExpr":
        return this.checkIfExpr(expr as AST.IfExpr);

      case "MatchExpr":
        return this.checkMatchExpr(expr as AST.MatchExpr);

      default:
        return { name: "Unknown", isParametric: false };
    }
  }

  private checkBinaryOp(op: AST.BinaryOp): TypeInfo {
    const leftType = this.checkExpression(op.left);
    const rightType = this.checkExpression(op.right);

    // 타입 호환성 검사
    if (leftType.name !== rightType.name) {
      this.warning(
        `Binary operation on different types: ${leftType.name} and ${rightType.name}`,
        op.line,
        op.column
      );
    }

    // 연산자별 반환 타입
    if (["+", "-", "*", "/", "%"].includes(op.operator)) {
      return leftType; // 산술 연산은 좌변 타입 반환
    } else if (["==", "!=", "<", ">", "<=", ">=", "&&", "||"].includes(op.operator)) {
      return { name: "Bool", isParametric: false };
    }

    return leftType;
  }

  private checkUnaryOp(op: AST.UnaryOp): TypeInfo {
    return this.checkExpression(op.operand);
  }

  private checkCall(call: AST.Call): TypeInfo {
    if (call.function.type !== "Identifier") {
      return { name: "Unknown", isParametric: false };
    }

    const funcName = (call.function as AST.Identifier).name;
    const funcInfo = this.globalSymbols.functions.get(funcName);

    if (!funcInfo) {
      this.error(
        `Undefined function '${funcName}'`,
        call.line,
        call.column,
        "UNDEFINED_FUNC"
      );
      return { name: "Unknown", isParametric: false };
    }

    // 인자 수 검사
    if (call.arguments.length !== funcInfo.parameters.length) {
      this.error(
        `Function '${funcName}' expects ${funcInfo.parameters.length} arguments, got ${call.arguments.length}`,
        call.line,
        call.column,
        "ARG_COUNT_MISMATCH"
      );
    }

    // 인자 타입 검사
    for (let i = 0; i < call.arguments.length; i++) {
      const argType = this.checkExpression(call.arguments[i]);
      const paramType = funcInfo.parameters[i].type;

      if (argType.name !== paramType.name) {
        this.warning(
          `Argument ${i + 1} type mismatch: expected ${paramType.name}, got ${argType.name}`,
          call.line,
          call.column
        );
      }
    }

    return funcInfo.returnType || { name: "Unit", isParametric: false };
  }

  private checkFieldAccess(access: AST.FieldAccess): TypeInfo {
    const objType = this.checkExpression(access.object);
    const struct = this.globalSymbols.structs.get(objType.name);

    if (!struct) {
      this.error(
        `Type '${objType.name}' is not a struct`,
        access.line,
        access.column,
        "NOT_A_STRUCT"
      );
      return { name: "Unknown", isParametric: false };
    }

    const fieldType = struct.fields.get(access.field);

    if (!fieldType) {
      this.error(
        `Struct '${objType.name}' has no field '${access.field}'`,
        access.line,
        access.column,
        "NO_SUCH_FIELD"
      );
      return { name: "Unknown", isParametric: false };
    }

    return fieldType;
  }

  private checkIndexAccess(access: AST.IndexAccess): TypeInfo {
    const objType = this.checkExpression(access.object);
    const indexType = this.checkExpression(access.index);

    // 인덱스는 Int여야 함
    if (indexType.name !== "Int") {
      this.error(
        `Index must be Int, got ${indexType.name}`,
        access.line,
        access.column,
        "BAD_INDEX_TYPE"
      );
    }

    // 배열 타입 처리
    if (objType.isParametric && objType.parameters) {
      return objType.parameters[0] as TypeInfo;
    }

    return { name: "Unknown", isParametric: false };
  }

  private checkArrayLiteral(arr: AST.ArrayLiteral): TypeInfo {
    if (arr.elements.length === 0) {
      return { name: "Array", isParametric: true, parameters: ["Unknown"] };
    }

    const elementType = this.checkExpression(arr.elements[0]);

    // 모든 요소가 같은 타입인지 확인
    for (let i = 1; i < arr.elements.length; i++) {
      const elemType = this.checkExpression(arr.elements[i]);
      if (elemType.name !== elementType.name) {
        this.warning(
          `Array element type mismatch at index ${i}`,
          arr.line,
          arr.column
        );
      }
    }

    return {
      name: "Array",
      isParametric: true,
      parameters: [elementType],
    };
  }

  private checkIfExpr(ifExpr: AST.IfExpr): TypeInfo {
    this.checkExpression(ifExpr.condition);
    for (const stmt of ifExpr.thenBranch) {
      this.checkStatement(stmt);
    }
    if (ifExpr.elseBranch) {
      for (const stmt of ifExpr.elseBranch) {
        this.checkStatement(stmt);
      }
    }
    return { name: "Unit", isParametric: false };
  }

  private checkMatchExpr(matchExpr: AST.MatchExpr): TypeInfo {
    this.checkExpression(matchExpr.value);
    for (const c of matchExpr.cases) {
      for (const stmt of c.body) {
        this.checkStatement(stmt);
      }
    }
    return { name: "Unit", isParametric: false };
  }

  // ============= 헬퍼 함수 =============

  private lookup(name: string): ValueInfo | undefined {
    let current: SymbolTable | undefined = this.currentSymbols;

    while (current) {
      if (current.values.has(name)) {
        return current.values.get(name);
      }
      current = current.parent;
    }

    return undefined;
  }

  private typeAnnotationToInfo(ta: AST.TypeAnnotation): TypeInfo {
    return {
      name: ta.name,
      isParametric: ta.isParametric,
      parameters: ta.parameters
        ? ta.parameters.map(p =>
          typeof p === "string" ? p : p.name
        )
        : undefined,
    };
  }

  private inferType(expr: AST.Expression): TypeInfo {
    return this.checkExpression(expr);
  }

  private getElementType(arrayType: TypeInfo): TypeInfo {
    if (arrayType.isParametric && arrayType.parameters) {
      return typeof arrayType.parameters[0] === "string"
        ? { name: arrayType.parameters[0], isParametric: false }
        : (arrayType.parameters[0] as TypeInfo);
    }
    return { name: "Unknown", isParametric: false };
  }

  private error(
    message: string,
    line: number,
    column: number,
    code: string
  ): void {
    this.errors.push({ message, line, column, code });
  }

  private warning(message: string, line: number, column: number): void {
    this.warnings.push(
      `Line ${line}, Column ${column}: ${message}`
    );
  }
}
