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
      if (this.match(TokenType.FN, TokenType.DEF)) {
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
    const isFn = this.match(TokenType.FN);
    if (isFn) {
      this.consume(TokenType.FN, "Expected 'fn'");
    } else {
      this.consume(TokenType.DEF, "Expected 'def'");
    }

    const nameToken = this.peek();
    if (!nameToken || nameToken.type !== TokenType.IDENTIFIER) {
      this.errors.push("Expected function name");
      return null;
    }
    const name = nameToken.value;
    this.advance();

    // Parse generic type parameters if present: fn name<T> ( ... )
    let generics = [];
    if (this.match(TokenType.LT)) {
      this.advance(); // consume <
      while (!this.match(TokenType.GT) && !this.match(TokenType.EOF)) {
        const typeParam = this.peek().value;
        this.advance();
        generics.push(typeParam);
        if (this.match(TokenType.COMMA)) {
          this.advance();
        }
      }
      this.consume(TokenType.GT, "Expected '>' in generic parameters");
    }

    this.consume(TokenType.LPAREN, "Expected '('");
    const parameters = [];
    while (!this.match(TokenType.RPAREN) && !this.match(TokenType.EOF)) {
      const paramName = this.peek().value;
      this.advance();

      let paramType = "auto";
      if (this.match(TokenType.COLON)) {
        this.advance();
        paramType = this.peek().value;
        this.advance();
      }

      // Parse default value if present (e.g., x: Int = 10)
      let defaultValue = null;
      if (this.match(TokenType.ASSIGN)) {
        this.advance();
        // Parse constant expression for default value
        defaultValue = this.parsePrimary();
      }

      parameters.push({ name: paramName, type: paramType, defaultValue });

      if (this.match(TokenType.COMMA)) {
        this.advance();
      }
    }
    this.consume(TokenType.RPAREN, "Expected ')'");

    let returnType = "void";
    if (this.match(TokenType.ARROW)) {
      this.advance();
      // Parse return type (could be simple or tuple)
      if (this.match(TokenType.LPAREN)) {
        // Tuple type: (Type, Type, ...)
        this.advance();
        const types = [];
        while (!this.match(TokenType.RPAREN) && !this.match(TokenType.EOF)) {
          types.push(this.peek().value);
          this.advance();
          if (this.match(TokenType.COMMA)) this.advance();
        }
        this.consume(TokenType.RPAREN, "Expected ')'");
        returnType = { type: "tuple", types };
      } else {
        // Simple type
        returnType = this.peek().value;
        this.advance();
      }
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
      generics,
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

      // Skip var/let/mut keywords
      if (this.match(TokenType.VAR, TokenType.LET, TokenType.MUT)) {
        this.advance();
      }

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
    const maxIterations = 5000;
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
    } else if (this.match(TokenType.BREAK)) {
      this.advance();
      return { type: "BreakStatement" };
    } else if (this.match(TokenType.CONTINUE)) {
      this.advance();
      return { type: "ContinueStatement" };
    } else if (!this.match(TokenType.DEDENT, TokenType.EOF, TokenType.NEWLINE)) {
      return this.parseExpressionStatement();
    }

    return null;
  }

  parseVarDeclaration() {
    const line = this.peek().line;
    const isMutable = this.match(TokenType.VAR);
    this.advance();

    // Check for tuple unpacking: let (a, b) = ... or let a, b = ...
    let names = [];

    if (this.match(TokenType.LPAREN)) {
      // Parenthesized tuple unpacking: let (a, b) = ...
      this.advance();
      while (!this.match(TokenType.RPAREN) && !this.match(TokenType.EOF)) {
        const varName = this.peek().value;
        names.push(varName);
        this.advance();
        if (this.match(TokenType.COMMA)) {
          this.advance();
        }
      }
      this.consume(TokenType.RPAREN, "Expected ')' in tuple unpacking");
    } else {
      // Single or implicit tuple unpacking: let a, b = ... or let a = ...
      const name = this.peek().value;
      names.push(name);
      this.advance();

      // Check if this is multi-variable unpacking without parentheses
      while (this.match(TokenType.COMMA)) {
        // Look ahead to see if next is a valid identifier or end (=, :, etc)
        const nextIdx = this.current + 1;
        if (nextIdx < this.tokens.length && this.tokens[nextIdx].type === TokenType.IDENTIFIER) {
          this.advance(); // consume comma
          const nextName = this.peek().value;
          names.push(nextName);
          this.advance();
        } else {
          break;
        }
      }
    }

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

    // If multiple names, create TupleUnpacking node
    if (names.length > 1) {
      return {
        type: "TupleUnpacking",
        names,
        value,
        isMutable,
        line,
      };
    }

    return {
      type: "VariableDeclaration",
      name: names[0],
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

    // Handle elif and else
    const elseIfBranches = [];
    while (this.match(TokenType.ELIF)) {
      this.advance();
      const elifCondition = this.parseExpression();
      this.consume(TokenType.COLON, "Expected ':'");
      this.skipNewlines();
      this.consume(TokenType.INDENT, "Expected indented block");
      const elifBranch = this.parseIndentedBlock();
      this.consume(TokenType.DEDENT, "Expected dedent");
      elseIfBranches.push({
        condition: elifCondition,
        body: elifBranch,
      });
    }

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
      elseIfBranches: elseIfBranches.length > 0 ? elseIfBranches : undefined,
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

    // Skip newlines and indentation tokens (for multi-line returns)
    this.skipNewlines();
    while (this.match(TokenType.INDENT, TokenType.DEDENT)) {
      this.advance();
    }
    this.skipNewlines();

    if (!this.match(TokenType.DEDENT, TokenType.EOF)) {
      value = this.parseExpression();
    }

    return {
      type: "ReturnStatement",
      value,
      line,
    };
  }

  parseMatchExpression() {
    this.consume(TokenType.MATCH, "Expected 'match'");

    // Parse discriminant carefully to avoid parsing struct literals
    // CRITICAL: Don't use parseMultiplicative/parseAdditive because they call parsePostfix
    //           which treats "identifier {" as struct literal!
    let discriminant = this.parsePrimary();

    // Support binary operations on discriminant but stop at LBRACE
    while (this.match(TokenType.SLASH, TokenType.STAR, TokenType.PERCENT,
                       TokenType.PLUS, TokenType.MINUS)) {
      const op = this.peek().value;
      this.advance();
      const right = this.parsePrimary();
      discriminant = {
        type: "BinaryOp",
        operator: op,
        left: discriminant,
        right,
      };
    }

    // Skip newlines and indentation before match body
    this.skipNewlines();
    while (this.match(TokenType.INDENT, TokenType.DEDENT)) {
      this.advance();
    }
    this.skipNewlines();

    // Check for brace-based match
    if (this.match(TokenType.LBRACE)) {
      return this.parseMatchBraceBased(discriminant);
    }

    // Otherwise indentation-based
    return this.parseMatchIndentationBased(discriminant);
  }

  parseMatchBraceBased(discriminant) {
    this.consume(TokenType.LBRACE, "Expected '{'");
    const branches = [];
    let defaultBranch = null;
    const maxIterations = 5000;
    let iterations = 0;

    while (!this.match(TokenType.RBRACE) && !this.match(TokenType.EOF) && iterations < maxIterations) {
      iterations++;
      const startPos = this.current;

      this.skipNewlines();
      // Skip INDENT/DEDENT tokens within match block
      while (this.match(TokenType.INDENT, TokenType.DEDENT)) {
        this.advance();
      }

      if (this.match(TokenType.RBRACE)) break;

      if (this.match(TokenType.ELSE)) {
        this.advance();
        this.consume(TokenType.LBRACE, "Expected '{' for else arm");
        defaultBranch = this.parseLogicalOr();
        this.consume(TokenType.RBRACE, "Expected '}'");
      } else {
        const pattern = this.parsePrimary();
        this.consume(TokenType.LBRACE, "Expected '{' for pattern");
        const body = this.parseLogicalOr();
        this.consume(TokenType.RBRACE, "Expected '}'");
        branches.push({ pattern, body });
      }

      // If no progress made, skip a token to avoid infinite loop
      if (this.current === startPos && !this.match(TokenType.RBRACE)) {
        this.advance();
      }
    }

    this.consume(TokenType.RBRACE, "Expected '}' to close match");

    return {
      type: "MatchExpression",
      discriminant,
      branches,
      defaultBranch,
    };
  }

  parseMatchIndentationBased(discriminant) {
    this.skipNewlines();
    this.consume(TokenType.INDENT, "Expected indented block for match");

    const branches = [];
    let defaultBranch = null;
    const maxIterations = 5000;
    let iterations = 0;

    while (!this.match(TokenType.DEDENT) && !this.match(TokenType.EOF) && iterations < maxIterations) {
      iterations++;
      const startPos = this.current;

      this.skipNewlines();
      if (this.match(TokenType.DEDENT)) break;

      if (this.match(TokenType.ELSE)) {
        this.advance();
        defaultBranch = this.parseLogicalOr();
        this.skipNewlines();
      } else {
        const pattern = this.parsePrimary();
        const body = this.parseLogicalOr();
        branches.push({ pattern, body });
        this.skipNewlines();
      }

      // If no progress, skip a token
      if (this.current === startPos && !this.match(TokenType.DEDENT)) {
        this.advance();
      }
    }

    this.consume(TokenType.DEDENT, "Expected dedent");

    return {
      type: "MatchExpression",
      discriminant,
      branches,
      defaultBranch,
    };
  }

  parseExpressionStatement() {
    // Check for tuple unpacking: a, b = value (without let/var)
    if (this.match(TokenType.IDENTIFIER)) {
      const identPos = this.current;
      const firstName = this.peek().value;
      this.advance();

      // Check if next is COMMA (tuple unpacking)
      if (this.match(TokenType.COMMA)) {
        const names = [firstName];
        while (this.match(TokenType.COMMA)) {
          this.advance();
          if (this.match(TokenType.IDENTIFIER)) {
            names.push(this.peek().value);
            this.advance();
          }
        }

        // Now expect = for assignment
        if (this.match(TokenType.ASSIGN)) {
          this.advance();
          const value = this.parseExpression();
          return {
            type: "TupleUnpacking",
            names,
            value,
            isMutable: false,
            line: this.tokens[identPos].line,
          };
        } else {
          // Not a tuple unpacking assignment, backtrack and parse as expression
          this.current = identPos;
        }
      } else {
        // Not a tuple unpacking, backtrack and continue normal parsing
        this.current = identPos;
      }
    }

    const expr = this.parseExpression();

    // Assignment: identifier = value, +=, -=, *=, /=
    if (this.match(
      TokenType.ASSIGN,
      TokenType.PLUS_ASSIGN,
      TokenType.MINUS_ASSIGN,
      TokenType.STAR_ASSIGN,
      TokenType.SLASH_ASSIGN
    )) {
      const operator = this.peek().value;
      this.advance();
      const value = this.parseExpression();
      return {
        type: "Assignment",
        target: expr,
        operator,
        value,
      };
    }

    return {
      type: "ExpressionStatement",
      expression: expr,
    };
  }

  parseExpression() {
    // Handle match expression at expression level to prevent infinite recursion
    if (this.match(TokenType.MATCH)) {
      return this.parseMatchExpression();
    }
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

    return this.parseExponentiation();
  }

  parseExponentiation() {
    let left = this.parsePostfix();

    while (this.match(TokenType.POWER)) {
      const op = this.advance().value;
      const right = this.parsePostfix();
      left = {
        type: "BinaryOp",
        operator: op,
        left,
        right,
      };
    }

    return left;
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
      } else if (this.match(TokenType.LBRACE) && expr.type === "Identifier") {
        // Struct literal: StructName { field1: value1, field2: value2 }
        this.advance();
        const fields = {};
        this.skipNewlines();

        // Handle indentation within struct literal
        let inIndent = false;
        if (this.match(TokenType.INDENT)) {
          this.advance();
          inIndent = true;
        }

        while (!this.match(TokenType.RBRACE) && !this.match(TokenType.EOF)) {
          this.skipNewlines();
          if (this.match(TokenType.RBRACE)) break;
          if (this.match(TokenType.DEDENT)) {
            if (inIndent) {
              this.advance();
              inIndent = false;
            }
            continue;
          }

          const fieldName = this.peek().value;
          this.advance();
          this.consume(TokenType.COLON, "Expected ':'");
          const fieldValue = this.parseExpression();
          fields[fieldName] = fieldValue;

          if (this.match(TokenType.COMMA)) this.advance();
          this.skipNewlines();
        }
        this.consume(TokenType.RBRACE, "Expected '}'");
        expr = {
          type: "StructLiteral",
          structName: expr.name,
          fields,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  parsePrimary() {
    // Removed match expression from here to prevent infinite recursion
    // Match is now handled at expression level

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

      // Check for empty tuple
      if (this.match(TokenType.RPAREN)) {
        this.advance();
        return { type: "TupleLiteral", elements: [] };
      }

      const firstExpr = this.parseExpression();

      // Check if tuple (has comma) or just parenthesized expression
      if (this.match(TokenType.COMMA)) {
        // Tuple literal
        const elements = [firstExpr];
        while (this.match(TokenType.COMMA) && !this.match(TokenType.RPAREN)) {
          this.advance();
          if (!this.match(TokenType.RPAREN)) {
            elements.push(this.parseExpression());
          }
        }
        this.consume(TokenType.RPAREN, "Expected ')'");
        return { type: "TupleLiteral", elements };
      } else {
        // Just parenthesized expression
        this.consume(TokenType.RPAREN, "Expected ')'");
        return firstExpr;
      }
    }

    this.errors.push(`Unexpected token at line ${this.peek().line}: ${this.peek().type}`);
    return { type: "Identifier", name: "error" };
  }

  parse() {
    return this.parseProgram();
  }
}

module.exports = { ParserIndent };
