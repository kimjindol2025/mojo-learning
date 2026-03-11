/**
 * Mojo Compiler - Semantic Analyzer (Phase 2)
 * 역할: AST 검증, 심볼 테이블 관리, 타입 검사
 */

class Symbol {
  constructor(name, type, line, kind = "variable") {
    this.name = name;
    this.type = type;        // "int", "string", "bool", "float", "array", etc.
    this.line = line;        // 정의 위치
    this.kind = kind;        // "variable", "function", "struct"
    this.defined = true;
    this.used = false;
  }
}

class SymbolTable {
  constructor(parent = null) {
    this.symbols = {};       // { name: Symbol }
    this.parent = parent;
    this.children = [];
    if (parent) {
      parent.children.push(this);
    }
  }

  define(name, type, line, kind = "variable") {
    if (this.symbols[name]) {
      throw new Error(
        `Semantic Error: Variable '${name}' already defined at line ${this.symbols[name].line}, redefined at line ${line}`
      );
    }
    this.symbols[name] = new Symbol(name, type, line, kind);
    return this.symbols[name];
  }

  lookup(name) {
    if (this.symbols[name]) {
      return this.symbols[name];
    }
    if (this.parent) {
      return this.parent.lookup(name);
    }
    return null;
  }

  // 변수 사용 표시
  use(name, line) {
    const symbol = this.lookup(name);
    if (!symbol) {
      throw new Error(`Semantic Error: Variable '${name}' not defined (used at line ${line})`);
    }
    symbol.used = true;
    return symbol;
  }

  // 미사용 변수 경고
  getUnusedVariables() {
    const unused = [];
    for (const name in this.symbols) {
      const symbol = this.symbols[name];
      if (!symbol.used && symbol.kind === "variable") {
        unused.push({ name, line: symbol.line });
      }
    }
    return unused;
  }
}

class SemanticAnalyzer {
  constructor() {
    this.globalTable = new SymbolTable();
    this.currentTable = this.globalTable;
    this.errors = [];
    this.warnings = [];
    this.functionSignatures = {};  // { "funcName(int,string)": "int" }

    // 내장 함수 정의
    this.defineBuiltins();
  }

  defineBuiltins() {
    // I/O 함수
    this.globalTable.define("print", "function", 0, "function");
    this.globalTable.define("len", "function", 0, "function");
    this.globalTable.define("str", "function", 0, "function");
    this.globalTable.define("range", "function", 0, "function");

    // 타입 함수
    this.globalTable.define("int", "function", 0, "function");
    this.globalTable.define("float", "function", 0, "function");
    this.globalTable.define("bool", "function", 0, "function");

    // 수학 함수
    this.globalTable.define("abs", "function", 0, "function");
    this.globalTable.define("min", "function", 0, "function");
    this.globalTable.define("max", "function", 0, "function");
  }

  // 스코프 진입
  enterScope() {
    const newTable = new SymbolTable(this.currentTable);
    this.currentTable = newTable;
    return newTable;
  }

  // 스코프 퇴출
  exitScope() {
    const unused = this.currentTable.getUnusedVariables();
    unused.forEach(({ name, line }) => {
      this.warnings.push(`Warning: Unused variable '${name}' at line ${line}`);
    });
    this.currentTable = this.currentTable.parent;
  }

  // AST 분석
  analyze(program) {
    try {
      this.analyzeProgram(program);
      return {
        success: this.errors.length === 0,
        errors: this.errors,
        warnings: this.warnings,
        symbolTable: this.globalTable,
      };
    } catch (e) {
      this.errors.push(e.message);
      return {
        success: false,
        errors: this.errors,
        warnings: this.warnings,
      };
    }
  }

  analyzeProgram(program) {
    for (const item of program.items) {
      if (item.type === "FunctionDeclaration") {
        this.analyzeFunctionDecl(item);
      } else if (item.type === "StructDeclaration") {
        this.analyzeStructDecl(item);
      }
    }
  }

  analyzeFunctionDecl(func) {
    // 함수 이름 정의 (오버로딩 지원)
    const paramTypes = func.parameters.map(p => p.type || "auto");
    const signature = `${func.name}(${paramTypes.join(",")})`;

    // 함수 시그니처가 다르면 오버로딩 허용
    if (!this.functionSignatures[signature]) {
      if (!this.currentTable.lookup(func.name)) {
        // 첫 정의인 경우만 심볼 테이블에 등록
        this.currentTable.define(func.name, "function", func.line, "function");
      }
    }
    this.functionSignatures[signature] = func.returnType || "void";

    // 함수 본문 스코프
    this.enterScope();
    
    // 매개변수 정의
    for (const param of func.parameters) {
      this.currentTable.define(param.name, param.type || "auto", func.line);
    }

    // 본문 분석
    for (const stmt of func.body) {
      this.analyzeStatement(stmt);
    }

    this.exitScope();
  }

  analyzeStructDecl(struct) {
    this.currentTable.define(struct.name, "struct", struct.line, "struct");
  }

  analyzeStatement(stmt) {
    if (!stmt) return;

    switch (stmt.type) {
      case "VariableDeclaration":
        this.analyzeVarDecl(stmt);
        break;
      case "TupleUnpacking":
        this.analyzeTupleUnpacking(stmt);
        break;
      case "Assignment":
        this.analyzeAssignment(stmt);
        break;
      case "IfStatement":
        this.analyzeIfStatement(stmt);
        break;
      case "ForLoop":
        this.analyzeForLoop(stmt);
        break;
      case "WhileLoop":
        this.analyzeWhileLoop(stmt);
        break;
      case "ReturnStatement":
        this.analyzeReturnStmt(stmt);
        break;
      case "ExpressionStatement":
        this.analyzeExpression(stmt.expression);
        break;
    }
  }

  analyzeVarDecl(decl) {
    // 변수 정의
    this.currentTable.define(decl.name, decl.typeAnnotation || "auto", decl.line);

    // 초기값 분석
    if (decl.value) {
      this.analyzeExpression(decl.value);
    }
  }

  analyzeTupleUnpacking(stmt) {
    // Tuple unpacking: (a, b) = value or a, b = value
    // Define all variables in the tuple
    for (const name of stmt.names) {
      const symbol = this.currentTable.lookup(name);
      if (!symbol) {
        this.currentTable.define(name, "auto", stmt.line || 0);
      } else {
        symbol.used = true;
      }
    }

    // Analyze the right-hand side expression
    if (stmt.value) {
      this.analyzeExpression(stmt.value);
    }
  }

  analyzeAssignment(assign) {
    // 좌변: 변수 정의 또는 사용
    if (assign.target.type === "Identifier") {
      const name = assign.target.name;
      const symbol = this.currentTable.lookup(name);

      if (!symbol) {
        // 변수가 정의되지 않았으면 자동으로 정의 (Python 스타일)
        this.currentTable.define(name, "auto", assign.target.line || 0);
      } else {
        // 기존 변수이면 사용 표시
        symbol.used = true;
      }
    }

    // 우변: 표현식 분석
    this.analyzeExpression(assign.value);
  }

  analyzeIfStatement(stmt) {
    this.analyzeExpression(stmt.condition);

    // 조건문 본문 스코프
    this.enterScope();
    for (const s of stmt.thenBranch) {
      this.analyzeStatement(s);
    }
    this.exitScope();

    // elif 분석
    if (stmt.elseIfBranches) {
      for (const elifBranch of stmt.elseIfBranches) {
        this.analyzeExpression(elifBranch.condition);
        this.enterScope();
        for (const s of elifBranch.body) {
          this.analyzeStatement(s);
        }
        this.exitScope();
      }
    }

    // else 분석
    if (stmt.elseBranch) {
      this.enterScope();
      for (const s of stmt.elseBranch) {
        this.analyzeStatement(s);
      }
      this.exitScope();
    }
  }

  analyzeForLoop(loop) {
    this.analyzeExpression(loop.iterable);

    // 반복 변수 스코프
    this.enterScope();
    this.currentTable.define(loop.variable, "auto", loop.line);

    for (const stmt of loop.body) {
      this.analyzeStatement(stmt);
    }

    this.exitScope();
  }

  analyzeWhileLoop(loop) {
    this.analyzeExpression(loop.condition);

    this.enterScope();
    for (const stmt of loop.body) {
      this.analyzeStatement(stmt);
    }
    this.exitScope();
  }

  analyzeReturnStmt(stmt) {
    if (stmt.value) {
      this.analyzeExpression(stmt.value);
    }
  }

  analyzeExpression(expr) {
    if (!expr) return;

    switch (expr.type) {
      case "Identifier":
        this.currentTable.use(expr.name, expr.line || 0);
        break;
      case "BinaryOp":
        this.analyzeExpression(expr.left);
        this.analyzeExpression(expr.right);
        break;
      case "UnaryOp":
        this.analyzeExpression(expr.operand);
        break;
      case "Call":
        this.analyzeExpression(expr.function);
        for (const arg of expr.arguments) {
          this.analyzeExpression(arg);
        }
        break;
      case "FieldAccess":
        this.analyzeExpression(expr.object);
        break;
      case "IndexAccess":
        this.analyzeExpression(expr.object);
        this.analyzeExpression(expr.index);
        break;
      case "MatchExpression":
        this.analyzeMatchExpression(expr);
        break;
      case "ArrayLiteral":
        for (const elem of expr.elements) {
          this.analyzeExpression(elem);
        }
        break;
    }
  }

  analyzeMatchExpression(expr) {
    this.analyzeExpression(expr.discriminant);
    for (const branch of expr.branches) {
      this.analyzeExpression(branch.pattern);
      this.analyzeExpression(branch.body);
    }
    if (expr.defaultBranch) {
      this.analyzeExpression(expr.defaultBranch);
    }
  }
}

module.exports = { SemanticAnalyzer, SymbolTable, Symbol };
