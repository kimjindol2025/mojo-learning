/**
 * Mojo Compiler - Parser with Indentation Support (JavaScript)
 * 역할: INDENT/DEDENT 토큰을 처리하여 Python 스타일 들여쓰기 파싱
 */

const { TokenType } = require("./lexer-indent");

class ParserIndent {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
    this.errors = [];
  }

  peek(offset = 0) {
    const pos = this.current + offset;
    if (pos >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[pos];
  }

  advance() {
    const token = this.peek();
    if (token.type !== TokenType.EOF) {
      this.current++;
    }
    return token;
  }

  match(...types) {
    return types.includes(this.peek().type);
  }

  consume(type, message) {
    if (this.peek().type === type) {
      return this.advance();
    }
    this.errors.push(`${message} at line ${this.peek().line}, got ${this.peek().type}`);
    return null;
  }

  skipNewlines() {
    while (this.match(TokenType.NEWLINE)) {
      this.advance();
    }
  }

  parseProgram() {
    const items = [];
    this.skipNewlines();

    while (!this.match(TokenType.EOF)) {
      if (this.match(TokenType.FN)) {
        const fn = this.parseFunction();
        if (fn) items.push(fn);
      } else if (this.match(TokenType.STRUCT)) {
        const struct = this.parseStruct();
        if (struct) items.push(struct);
      } else {
        this.skipNewlines();
        if (!this.match(TokenType.EOF)) {
          this.advance();
        }
      }
      this.skipNewlines();
    }

    return {
      type: "Program",
      items,
    };
  }

  parseFunction() {
    const line = this.peek().line;
    const column = this.peek().column;
    this.consume(TokenType.FN, "Expected 'fn'");

    const nameToken = this.peek();
    if (!nameToken || nameToken.type !== TokenType.IDENTIFIER) {
      this.errors.push("Expected function name");
      return null;
    }
    const name = nameToken.value;
    this.advance();

    this.consume(TokenType.LPAREN, "Expected '('");
    const parameters = [];
    while (!this.match(TokenType.RPAREN) && !this.match(TokenType.EOF)) {
      const paramName = this.peek().value;
      this.advance();

      if (this.match(TokenType.COLON)) {
        this.advance();
        const typeName = this.peek().value;
        this.advance();
        parameters.push({ name: paramName, type: typeName });
      } else {
        parameters.push({ name: paramName, type: "auto" });
      }

      if (this.match(TokenType.COMMA)) {
        this.advance();
      }
    }
    this.consume(TokenType.RPAREN, "Expected ')'");

    let returnType = "void";
    if (this.match(TokenType.ARROW)) {
      this.advance();
      returnType = this.peek().value;
      this.advance();
    }

    this.consume(TokenType.COLON, "Expected ':'");
    this.skipNewlines();

    // 들여쓰기 블록 파싱
    this.consume(TokenType.INDENT, "Expected indented block");
    const body = this.parseIndentedBlock();
    this.consume(TokenType.DEDENT, "Expected dedent");

    return {
      type: "FunctionDeclaration",
      name,
      parameters,
      returnType,
      body,
      line,
      column,
    };
  }

  parseStruct() {
    const line = this.peek().line;
    const column = this.peek().column;
    this.consume(TokenType.STRUCT, "Expected 'struct'");

    const name = this.peek().value;
    this.consume(TokenType.IDENTIFIER, "Expected struct name");

    this.consume(TokenType.COLON, "Expected ':'");
    this.skipNewlines();

    this.consume(TokenType.INDENT, "Expected indented block");
    const fields = [];
    while (!this.match(TokenType.DEDENT) && !this.match(TokenType.EOF)) {
      this.skipNewlines();
      if (this.match(TokenType.DEDENT)) break;

      const fieldName = this.peek().value;
      this.advance();
      this.consume(TokenType.COLON, "Expected ':'");
      const fieldType = this.peek().value;
      this.advance();
      fields.push({ name: fieldName, type: fieldType });

      this.skipNewlines();
    }
    this.consume(TokenType.DEDENT, "Expected dedent");

    return {
      type: "StructDeclaration",
      name,
      fields,
      line,
      column,
    };
  }

  parseIndentedBlock() {
    const statements = [];
    const maxIterations = 1000;
    let iterations = 0;

    while (!this.match(TokenType.DEDENT) && !this.match(TokenType.EOF) && iterations < maxIterations) {
      iterations++;
      this.skipNewlines();

      if (this.match(TokenType.DEDENT)) break;

      const startPos = this.current;
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }

      // 토큰이 진행되지 않았으면 스킵
      if (this.current === startPos && !this.match(TokenType.DEDENT)) {
        this.advance();
      }

      this.skipNewlines();
    }

    return statements;
  }

  parseStatement() {
    if (this.match(TokenType.LET, TokenType.VAR)) {
      return this.parseVarDeclaration();
    } else if (this.match(TokenType.IF)) {
      return this.parseIfStatement();
    } else if (this.match(TokenType.FOR)) {
      return this.parseForLoop();
    } else if (this.match(TokenType.WHILE)) {
      return this.parseWhileLoop();
    } else if (this.match(TokenType.RETURN)) {
      return this.parseReturnStatement();
    } else if (!this.match(TokenType.DEDENT, TokenType.EOF, TokenType.NEWLINE)) {
      return this.parseExpressionStatement();
    }

    return null;
  }

  parseVarDeclaration() {
    const line = this.peek().line;
    const isMutable = this.match(TokenType.VAR);
    this.advance();

    const name = this.peek().value;
    this.advance();

    let typeAnnotation = null;
    if (this.match(TokenType.COLON)) {
      this.advance();
      // 타입 이름이 있으면 파싱
      if (this.match(TokenType.IDENTIFIER)) {
        typeAnnotation = this.peek().value;
        this.advance();
      }
    }

    let value = null;
    if (this.match(TokenType.ASSIGN)) {
      this.advance();
      value = this.parseExpression();
    }

    return {
      type: "VariableDeclaration",
      name,
      typeAnnotation,
      value,
      isMutable,
      line,
    };
  }

  parseIfStatement() {
    const line = this.peek().line;
    this.consume(TokenType.IF, "Expected 'if'");
    const condition = this.parseExpression();
    this.consume(TokenType.COLON, "Expected ':'");
    this.skipNewlines();
    this.consume(TokenType.INDENT, "Expected indented block");
    const thenBranch = this.parseIndentedBlock();
    this.consume(TokenType.DEDENT, "Expected dedent");

    let elseBranch = null;
    if (this.match(TokenType.ELSE)) {
      this.advance();
      this.consume(TokenType.COLON, "Expected ':'");
      this.skipNewlines();
      this.consume(TokenType.INDENT, "Expected indented block");
      elseBranch = this.parseIndentedBlock();
      this.consume(TokenType.DEDENT, "Expected dedent");
    }

    return {
      type: "IfStatement",
      condition,
      thenBranch,
      elseBranch,
      line,
    };
  }

  parseForLoop() {
    const line = this.peek().line;
    this.consume(TokenType.FOR, "Expected 'for'");
    const variable = this.peek().value;
    this.advance();
    this.consume(TokenType.IN, "Expected 'in'");
    const iterable = this.parseExpression();
    this.consume(TokenType.COLON, "Expected ':'");
    this.skipNewlines();
    this.consume(TokenType.INDENT, "Expected indented block");
    const body = this.parseIndentedBlock();
    this.consume(TokenType.DEDENT, "Expected dedent");

    return {
      type: "ForLoop",
      variable,
      iterable,
      body,
      line,
    };
  }

  parseWhileLoop() {
    const line = this.peek().line;
    this.consume(TokenType.WHILE, "Expected 'while'");
    const condition = this.parseExpression();
    this.consume(TokenType.COLON, "Expected ':'");
    this.skipNewlines();
    this.consume(TokenType.INDENT, "Expected indented block");
    const body = this.parseIndentedBlock();
    this.consume(TokenType.DEDENT, "Expected dedent");

    return {
      type: "WhileLoop",
      condition,
      body,
      line,
    };
  }

  parseReturnStatement() {
    const line = this.peek().line;
    this.consume(TokenType.RETURN, "Expected 'return'");
    let value = null;
    if (!this.match(TokenType.NEWLINE, TokenType.DEDENT, TokenType.EOF)) {
      value = this.parseExpression();
    }

    return {
      type: "ReturnStatement",
      value,
      line,
    };
  }

  parseExpressionStatement() {
    const expr = this.parseExpression();
    return {
      type: "ExpressionStatement",
      expression: expr,
    };
  }

  parseExpression() {
    return this.parseLogicalOr();
  }

  parseLogicalOr() {
    let left = this.parseLogicalAnd();

    while (this.match(TokenType.OR)) {
      this.advance();
      const right = this.parseLogicalAnd();
      left = {
        type: "BinaryOp",
        operator: "||",
        left,
        right,
      };
    }

    return left;
  }

  parseLogicalAnd() {
    let left = this.parseEquality();

    while (this.match(TokenType.AND)) {
      this.advance();
      const right = this.parseEquality();
      left = {
        type: "BinaryOp",
        operator: "&&",
        left,
        right,
      };
    }

    return left;
  }

  parseEquality() {
    let left = this.parseComparison();

    while (this.match(TokenType.EQ, TokenType.NE)) {
      const op = this.advance().value;
      const right = this.parseComparison();
      left = {
        type: "BinaryOp",
        operator: op,
        left,
        right,
      };
    }

    return left;
  }

  parseComparison() {
    let left = this.parseAdditive();

    while (this.match(TokenType.LT, TokenType.LE, TokenType.GT, TokenType.GE)) {
      const op = this.advance().value;
      const right = this.parseAdditive();
      left = {
        type: "BinaryOp",
        operator: op,
        left,
        right,
      };
    }

    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const op = this.advance().value;
      const right = this.parseMultiplicative();
      left = {
        type: "BinaryOp",
        operator: op,
        left,
        right,
      };
    }

    return left;
  }

  parseMultiplicative() {
    let left = this.parseUnary();

    while (this.match(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {
      const op = this.advance().value;
      const right = this.parseUnary();
      left = {
        type: "BinaryOp",
        operator: op,
        left,
        right,
      };
    }

    return left;
  }

  parseUnary() {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const op = this.advance().value;
      const operand = this.parseUnary();
      return {
        type: "UnaryOp",
        operator: op,
        operand,
      };
    }

    return this.parsePostfix();
  }

  parsePostfix() {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        this.advance();
        const args = [];
        while (!this.match(TokenType.RPAREN) && !this.match(TokenType.EOF)) {
          args.push(this.parseExpression());
          if (this.match(TokenType.COMMA)) this.advance();
        }
        this.consume(TokenType.RPAREN, "Expected ')'");
        expr = {
          type: "Call",
          function: expr,
          arguments: args,
        };
      } else if (this.match(TokenType.DOT)) {
        this.advance();
        const field = this.peek().value;
        this.advance();
        expr = {
          type: "FieldAccess",
          object: expr,
          field,
        };
      } else if (this.match(TokenType.LBRACK)) {
        this.advance();
        const index = this.parseExpression();
        this.consume(TokenType.RBRACK, "Expected ']'");
        expr = {
          type: "IndexAccess",
          object: expr,
          index,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  parsePrimary() {
    if (this.match(TokenType.INTEGER)) {
      const value = this.peek().value;
      this.advance();
      return { type: "IntLiteral", value };
    }

    if (this.match(TokenType.FLOAT)) {
      const value = this.peek().value;
      this.advance();
      return { type: "FloatLiteral", value };
    }

    if (this.match(TokenType.STRING)) {
      const value = this.peek().value;
      this.advance();
      return { type: "StringLiteral", value };
    }

    if (this.match(TokenType.TRUE, TokenType.FALSE)) {
      const value = this.peek().type === TokenType.TRUE;
      this.advance();
      return { type: "BoolLiteral", value };
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const name = this.peek().value;
      this.advance();
      return { type: "Identifier", name };
    }

    if (this.match(TokenType.LBRACK)) {
      this.advance();
      const elements = [];
      while (!this.match(TokenType.RBRACK) && !this.match(TokenType.EOF)) {
        elements.push(this.parseExpression());
        if (this.match(TokenType.COMMA)) this.advance();
      }
      this.consume(TokenType.RBRACK, "Expected ']'");
      return { type: "ArrayLiteral", elements };
    }

    if (this.match(TokenType.LPAREN)) {
      this.advance();
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, "Expected ')'");
      return expr;
    }

    this.errors.push(`Unexpected token at line ${this.peek().line}: ${this.peek().type}`);
    return { type: "Identifier", name: "error" };
  }

  parse() {
    return this.parseProgram();
  }
}

module.exports = { ParserIndent };
