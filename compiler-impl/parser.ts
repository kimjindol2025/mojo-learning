/**
 * Mojo Compiler - Parser Phase
 *
 * 역할: 토큰 스트림 → AST (Abstract Syntax Tree) 생성
 *
 * Recursive Descent Parser 구현
 * 연산자 우선순위 수준:
 * 1. || (OR)
 * 2. && (AND)
 * 3. ==, !=, <, >, <=, >=
 * 4. +, -
 * 5. *, /, %
 * 6. 단항 연산자 (!, -)
 * 7. 함수 호출, 필드 접근
 */

import { Token, TokenType, Lexer } from "./lexer";
import * as AST from "./ast";

export class Parser {
  private tokens: Token[];
  private current: number = 0;
  private errors: AST.CompileError[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(offset: number = 0): Token {
    const pos = this.current + offset;
    if (pos >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1]; // EOF
    }
    return this.tokens[pos];
  }

  private advance(): Token {
    const token = this.peek();
    if (token.type !== TokenType.EOF) {
      this.current++;
    }
    return token;
  }

  private match(...types: TokenType[]): boolean {
    return types.includes(this.peek().type);
  }

  private consume(type: TokenType, message: string): Token {
    if (this.peek().type === type) {
      return this.advance();
    }
    this.error(message);
    return this.peek();
  }

  private error(message: string): void {
    const token = this.peek();
    this.errors.push({
      message,
      line: token.line,
      column: token.column,
      code: "PARSE_ERROR",
    });
  }

  // ============= 메인 파싱 함수 =============

  public parse(): AST.Program {
    const items: (AST.FunctionDeclaration | AST.StructDeclaration)[] = [];

    while (!this.match(TokenType.EOF)) {
      if (this.match(TokenType.FN)) {
        items.push(this.parseFunctionDeclaration());
      } else if (this.match(TokenType.STRUCT)) {
        items.push(this.parseStructDeclaration());
      } else {
        this.error("Expected function or struct declaration");
        this.advance();
      }
    }

    return {
      type: "Program",
      items,
      line: 1,
      column: 1,
    };
  }

  // ============= 함수 파싱 =============

  private parseFunctionDeclaration(): AST.FunctionDeclaration {
    const fnToken = this.consume(TokenType.FN, "Expected 'fn'");
    const line = fnToken.line;
    const column = fnToken.column;

    const name = this.consume(
      TokenType.IDENTIFIER,
      "Expected function name"
    ).value as string;

    // 파라미터 파싱
    this.consume(TokenType.LPAREN, "Expected '('");
    const parameters = this.parseParameters();
    this.consume(TokenType.RPAREN, "Expected ')'");

    // 반환 타입 파싱
    let returnType: AST.TypeAnnotation | undefined;
    if (this.match(TokenType.ARROW)) {
      this.advance();
      returnType = this.parseType();
    }

    // 함수 바디 파싱
    this.consume(TokenType.LBRACE, "Expected '{'");
    const body = this.parseBlock();
    this.consume(TokenType.RBRACE, "Expected '}'");

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

  private parseParameters(): AST.Parameter[] {
    const parameters: AST.Parameter[] = [];

    if (this.match(TokenType.RPAREN)) {
      return parameters;
    }

    do {
      const token = this.peek();
      let ownership: "owned" | "borrowed" | "mut" = "borrowed";

      if (this.match(TokenType.OWNED)) {
        ownership = "owned";
        this.advance();
      } else if (this.match(TokenType.MUT)) {
        ownership = "mut";
        this.advance();
      }

      const name = this.consume(
        TokenType.IDENTIFIER,
        "Expected parameter name"
      ).value as string;

      this.consume(TokenType.COLON, "Expected ':' in parameter");
      const typeAnnotation = this.parseType();

      parameters.push({
        type: "Parameter",
        name,
        typeAnnotation,
        ownership,
        line: token.line,
        column: token.column,
      });

      if (!this.match(TokenType.COMMA)) break;
      this.advance();
    } while (true);

    return parameters;
  }

  private parseType(): AST.TypeAnnotation {
    const token = this.peek();
    const name = this.consume(
      TokenType.IDENTIFIER,
      "Expected type name"
    ).value as string;

    let isParametric = false;
    let parameters: (AST.TypeAnnotation | string)[] | undefined;

    if (this.match(TokenType.LBRACK)) {
      isParametric = true;
      this.advance();
      parameters = [];

      do {
        if (this.match(TokenType.INTEGER)) {
          parameters.push(this.peek().value as string);
          this.advance();
        } else {
          parameters.push(this.parseType());
        }

        if (!this.match(TokenType.COMMA)) break;
        this.advance();
      } while (true);

      this.consume(TokenType.RBRACK, "Expected ']'");
    }

    return {
      type: "TypeAnnotation",
      name,
      isParametric,
      parameters,
      line: token.line,
      column: token.column,
    };
  }

  // ============= 구조체 파싱 =============

  private parseStructDeclaration(): AST.StructDeclaration {
    const structToken = this.consume(TokenType.STRUCT, "Expected 'struct'");
    const line = structToken.line;
    const column = structToken.column;

    const name = this.consume(
      TokenType.IDENTIFIER,
      "Expected struct name"
    ).value as string;

    this.consume(TokenType.LBRACE, "Expected '{'");

    const fields: AST.StructField[] = [];
    while (!this.match(TokenType.RBRACE)) {
      const fieldToken = this.peek();
      const fieldName = this.consume(
        TokenType.IDENTIFIER,
        "Expected field name"
      ).value as string;
      this.consume(TokenType.COLON, "Expected ':'");
      const typeAnnotation = this.parseType();

      fields.push({
        type: "StructField",
        name: fieldName,
        typeAnnotation,
        line: fieldToken.line,
        column: fieldToken.column,
      });

      if (this.match(TokenType.COMMA)) {
        this.advance();
      }
    }

    this.consume(TokenType.RBRACE, "Expected '}'");

    return {
      type: "StructDeclaration",
      name,
      fields,
      line,
      column,
    };
  }

  // ============= 블록/명령문 파싱 =============

  private parseBlock(): AST.Statement[] {
    const statements: AST.Statement[] = [];

    while (
      !this.match(TokenType.RBRACE) &&
      !this.match(TokenType.EOF)
    ) {
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }

    return statements;
  }

  private parseStatement(): AST.Statement | null {
    const token = this.peek();
    const line = token.line;
    const column = token.column;

    // let/var 변수 선언
    if (this.match(TokenType.LET, TokenType.VAR)) {
      const isMutable = this.peek().type === TokenType.VAR;
      this.advance();

      const name = this.consume(
        TokenType.IDENTIFIER,
        "Expected variable name"
      ).value as string;

      let typeAnnotation: AST.TypeAnnotation | undefined;
      let value: AST.Expression | undefined;

      if (this.match(TokenType.COLON)) {
        this.advance();
        typeAnnotation = this.parseType();
      }

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
        column,
      };
    }

    // return 문
    if (this.match(TokenType.RETURN)) {
      this.advance();
      let value: AST.Expression | undefined;

      if (!this.match(TokenType.RBRACE, TokenType.EOF)) {
        value = this.parseExpression();
      }

      return {
        type: "ReturnStatement",
        value,
        line,
        column,
      };
    }

    // for 루프
    if (this.match(TokenType.FOR)) {
      this.advance();
      const variable = this.consume(
        TokenType.IDENTIFIER,
        "Expected variable name"
      ).value as string;
      this.consume(TokenType.IN, "Expected 'in'");
      const iterable = this.parseExpression();

      this.consume(TokenType.LBRACE, "Expected '{'");
      const body = this.parseBlock();
      this.consume(TokenType.RBRACE, "Expected '}'");

      return {
        type: "ForLoop",
        variable,
        iterable,
        body,
        line,
        column,
      };
    }

    // while 루프
    if (this.match(TokenType.WHILE)) {
      this.advance();
      const condition = this.parseExpression();

      this.consume(TokenType.LBRACE, "Expected '{'");
      const body = this.parseBlock();
      this.consume(TokenType.RBRACE, "Expected '}'");

      return {
        type: "WhileLoop",
        condition,
        body,
        line,
        column,
      };
    }

    // break
    if (this.match(TokenType.BREAK)) {
      this.advance();
      return {
        type: "BreakStatement",
        line,
        column,
      };
    }

    // continue
    if (this.match(TokenType.CONTINUE)) {
      this.advance();
      return {
        type: "ContinueStatement",
        line,
        column,
      };
    }

    // 표현식 명령문 (할당 또는 함수 호출)
    const expr = this.parseExpression();

    // 할당 처리
    if (
      this.match(
        TokenType.ASSIGN,
        TokenType.PLUS_ASSIGN,
        TokenType.MINUS_ASSIGN,
        TokenType.STAR_ASSIGN,
        TokenType.SLASH_ASSIGN
      )
    ) {
      const opToken = this.advance();
      const value = this.parseExpression();

      if (
        expr.type === "Identifier" ||
        expr.type === "FieldAccess" ||
        expr.type === "IndexAccess"
      ) {
        return {
          type: "Assignment",
          target: expr as any,
          value,
          operator: opToken.value as string,
          line,
          column,
        };
      }
    }

    return {
      type: "ExpressionStatement",
      expression: expr,
      line,
      column,
    };
  }

  // ============= 표현식 파싱 =============

  private parseExpression(): AST.Expression {
    return this.parseOrExpression();
  }

  private parseOrExpression(): AST.Expression {
    let left = this.parseAndExpression();

    while (this.match(TokenType.OR)) {
      const token = this.advance();
      const right = this.parseAndExpression();
      left = AST.createBinaryOp(
        token.value as string,
        left,
        right,
        token.line,
        token.column
      );
    }

    return left;
  }

  private parseAndExpression(): AST.Expression {
    let left = this.parseEqualityExpression();

    while (this.match(TokenType.AND)) {
      const token = this.advance();
      const right = this.parseEqualityExpression();
      left = AST.createBinaryOp(
        token.value as string,
        left,
        right,
        token.line,
        token.column
      );
    }

    return left;
  }

  private parseEqualityExpression(): AST.Expression {
    let left = this.parseComparisonExpression();

    while (this.match(TokenType.EQ, TokenType.NE)) {
      const token = this.advance();
      const right = this.parseComparisonExpression();
      left = AST.createBinaryOp(
        token.value as string,
        left,
        right,
        token.line,
        token.column
      );
    }

    return left;
  }

  private parseComparisonExpression(): AST.Expression {
    let left = this.parseAdditiveExpression();

    while (this.match(TokenType.LT, TokenType.LE, TokenType.GT, TokenType.GE)) {
      const token = this.advance();
      const right = this.parseAdditiveExpression();
      left = AST.createBinaryOp(
        token.value as string,
        left,
        right,
        token.line,
        token.column
      );
    }

    return left;
  }

  private parseAdditiveExpression(): AST.Expression {
    let left = this.parseMultiplicativeExpression();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const token = this.advance();
      const right = this.parseMultiplicativeExpression();
      left = AST.createBinaryOp(
        token.value as string,
        left,
        right,
        token.line,
        token.column
      );
    }

    return left;
  }

  private parseMultiplicativeExpression(): AST.Expression {
    let left = this.parseUnaryExpression();

    while (this.match(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {
      const token = this.advance();
      const right = this.parseUnaryExpression();
      left = AST.createBinaryOp(
        token.value as string,
        left,
        right,
        token.line,
        token.column
      );
    }

    return left;
  }

  private parseUnaryExpression(): AST.Expression {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const token = this.advance();
      const operand = this.parseUnaryExpression();
      return {
        type: "UnaryOp",
        operator: token.value as string,
        operand,
        line: token.line,
        column: token.column,
      };
    }

    return this.parsePostfixExpression();
  }

  private parsePostfixExpression(): AST.Expression {
    let expr = this.parsePrimaryExpression();

    while (true) {
      if (this.match(TokenType.DOT)) {
        this.advance();
        const field = this.consume(
          TokenType.IDENTIFIER,
          "Expected field name"
        ).value as string;
        expr = {
          type: "FieldAccess",
          object: expr,
          field,
          line: expr.line,
          column: expr.column,
        };
      } else if (this.match(TokenType.LBRACK)) {
        this.advance();
        const index = this.parseExpression();
        this.consume(TokenType.RBRACK, "Expected ']'");
        expr = {
          type: "IndexAccess",
          object: expr,
          index,
          line: expr.line,
          column: expr.column,
        };
      } else if (this.match(TokenType.LPAREN)) {
        this.advance();
        const args = this.parseArguments();
        this.consume(TokenType.RPAREN, "Expected ')'");
        expr = {
          type: "Call",
          function: expr,
          arguments: args,
          line: expr.line,
          column: expr.column,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private parsePrimaryExpression(): AST.Expression {
    const token = this.peek();
    const line = token.line;
    const column = token.column;

    // 리터럴
    if (this.match(TokenType.INTEGER)) {
      this.advance();
      return {
        type: "IntLiteral",
        value: token.value as number,
        line,
        column,
      };
    }

    if (this.match(TokenType.FLOAT)) {
      this.advance();
      return {
        type: "FloatLiteral",
        value: token.value as number,
        line,
        column,
      };
    }

    if (this.match(TokenType.STRING)) {
      this.advance();
      return {
        type: "StringLiteral",
        value: token.value as string,
        line,
        column,
      };
    }

    if (this.match(TokenType.TRUE, TokenType.FALSE)) {
      this.advance();
      return {
        type: "BoolLiteral",
        value: token.value as boolean,
        line,
        column,
      };
    }

    // 식별자
    if (this.match(TokenType.IDENTIFIER)) {
      this.advance();
      return AST.createIdentifier(
        token.value as string,
        line,
        column
      );
    }

    // 괄호 표현식
    if (this.match(TokenType.LPAREN)) {
      this.advance();
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, "Expected ')'");
      return expr;
    }

    // 배열 리터럴
    if (this.match(TokenType.LBRACK)) {
      this.advance();
      const elements: AST.Expression[] = [];

      while (!this.match(TokenType.RBRACK)) {
        elements.push(this.parseExpression());
        if (this.match(TokenType.COMMA)) {
          this.advance();
        }
      }

      this.consume(TokenType.RBRACK, "Expected ']'");

      return {
        type: "ArrayLiteral",
        elements,
        line,
        column,
      };
    }

    // if 표현식
    if (this.match(TokenType.IF)) {
      return this.parseIfExpression();
    }

    // match 표현식
    if (this.match(TokenType.MATCH)) {
      return this.parseMatchExpression();
    }

    this.error("Unexpected token in expression");
    this.advance();

    return AST.createIntLiteral(0, line, column);
  }

  private parseIfExpression(): AST.IfExpr {
    const token = this.peek();
    this.consume(TokenType.IF, "Expected 'if'");
    const condition = this.parseExpression();

    this.consume(TokenType.LBRACE, "Expected '{'");
    const thenBranch = this.parseBlock();
    this.consume(TokenType.RBRACE, "Expected '}'");

    let elseBranch: AST.Expression[] | undefined;
    let elseIfBranches: Array<{
      condition: AST.Expression;
      body: AST.Expression[];
    }> | undefined;

    if (this.match(TokenType.ELIF)) {
      elseIfBranches = [];
      while (this.match(TokenType.ELIF)) {
        this.advance();
        const elifCondition = this.parseExpression();
        this.consume(TokenType.LBRACE, "Expected '{'");
        const elifBody = this.parseBlock();
        this.consume(TokenType.RBRACE, "Expected '}'");
        elseIfBranches.push({ condition: elifCondition, body: elifBody });
      }
    }

    if (this.match(TokenType.ELSE)) {
      this.advance();
      this.consume(TokenType.LBRACE, "Expected '{'");
      elseBranch = this.parseBlock();
      this.consume(TokenType.RBRACE, "Expected '}'");
    }

    return {
      type: "IfExpr",
      condition,
      thenBranch,
      elseBranch,
      elseIfBranches,
      line: token.line,
      column: token.column,
    };
  }

  private parseMatchExpression(): AST.MatchExpr {
    const token = this.peek();
    this.consume(TokenType.MATCH, "Expected 'match'");
    const value = this.parseExpression();

    this.consume(TokenType.LBRACE, "Expected '{'");

    const cases: Array<{
      pattern: string | number;
      body: AST.Expression[];
    }> = [];
    let defaultCase: AST.Expression[] | undefined;

    while (!this.match(TokenType.RBRACE)) {
      if (this.match(TokenType.IDENTIFIER) && this.peek().value === "else") {
        this.advance();
        this.consume(TokenType.FAT_ARROW, "Expected '=>'");
        this.consume(TokenType.LBRACE, "Expected '{'");
        defaultCase = this.parseBlock();
        this.consume(TokenType.RBRACE, "Expected '}'");
      } else {
        const pattern = this.peek().value;
        this.advance();
        this.consume(TokenType.FAT_ARROW, "Expected '=>'");
        this.consume(TokenType.LBRACE, "Expected '{'");
        const body = this.parseBlock();
        this.consume(TokenType.RBRACE, "Expected '}'");

        cases.push({ pattern: pattern as string | number, body });
      }

      if (this.match(TokenType.COMMA)) {
        this.advance();
      }
    }

    this.consume(TokenType.RBRACE, "Expected '}'");

    return {
      type: "MatchExpr",
      value,
      cases,
      defaultCase,
      line: token.line,
      column: token.column,
    };
  }

  private parseArguments(): AST.Expression[] {
    const args: AST.Expression[] = [];

    if (this.match(TokenType.RPAREN)) {
      return args;
    }

    do {
      args.push(this.parseExpression());
      if (!this.match(TokenType.COMMA)) break;
      this.advance();
    } while (true);

    return args;
  }
}
