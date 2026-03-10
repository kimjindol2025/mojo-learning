/**
 * Mojo Compiler - Lexer Phase
 *
 * 역할: 소스 파일 → 토큰 스트림 변환
 *
 * Mojo 키워드와 토큰 규칙:
 * - Keywords: fn, let, var, if, else, for, while, return, struct, owned, borrowed, ...
 * - Literals: Int, Float, String, Bool
 * - Operators: +, -, *, /, =, ==, !=, &&, ||, ...
 */

export enum TokenType {
  // Keywords
  FN = "FN",
  LET = "LET",
  VAR = "VAR",
  IF = "IF",
  ELSE = "ELSE",
  ELIF = "ELIF",
  FOR = "FOR",
  WHILE = "WHILE",
  RETURN = "RETURN",
  STRUCT = "STRUCT",
  OWNED = "OWNED",
  BORROWED = "BORROWED",
  MUT = "MUT",
  MATCH = "MATCH",
  BREAK = "BREAK",
  CONTINUE = "CONTINUE",
  IN = "IN",
  TRUE = "TRUE",
  FALSE = "FALSE",

  // Literals
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  STRING = "STRING",
  IDENTIFIER = "IDENTIFIER",

  // Operators
  PLUS = "PLUS",
  MINUS = "MINUS",
  STAR = "STAR",
  SLASH = "SLASH",
  PERCENT = "PERCENT",
  ASSIGN = "ASSIGN",
  PLUS_ASSIGN = "PLUS_ASSIGN",
  MINUS_ASSIGN = "MINUS_ASSIGN",
  STAR_ASSIGN = "STAR_ASSIGN",
  SLASH_ASSIGN = "SLASH_ASSIGN",
  EQ = "EQ",
  NE = "NE",
  LT = "LT",
  LE = "LE",
  GT = "GT",
  GE = "GE",
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
  CARET = "CARET",

  // Delimiters
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  LBRACE = "LBRACE",
  RBRACE = "RBRACE",
  LBRACK = "LBRACK",
  RBRACK = "RBRACK",
  COMMA = "COMMA",
  DOT = "DOT",
  COLON = "COLON",
  SEMICOLON = "SEMICOLON",
  ARROW = "ARROW",
  FAT_ARROW = "FAT_ARROW",
  QUESTION = "QUESTION",

  // Special
  EOF = "EOF",
  NEWLINE = "NEWLINE",
}

export interface Token {
  type: TokenType;
  value: string | number | boolean;
  line: number;
  column: number;
}

export class Lexer {
  private source: string;
  private pos: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  private keywords: Map<string, TokenType> = new Map([
    ["fn", TokenType.FN],
    ["let", TokenType.LET],
    ["var", TokenType.VAR],
    ["if", TokenType.IF],
    ["else", TokenType.ELSE],
    ["elif", TokenType.ELIF],
    ["for", TokenType.FOR],
    ["while", TokenType.WHILE],
    ["return", TokenType.RETURN],
    ["struct", TokenType.STRUCT],
    ["owned", TokenType.OWNED],
    ["borrowed", TokenType.BORROWED],
    ["mut", TokenType.MUT],
    ["match", TokenType.MATCH],
    ["break", TokenType.BREAK],
    ["continue", TokenType.CONTINUE],
    ["in", TokenType.IN],
    ["true", TokenType.TRUE],
    ["false", TokenType.FALSE],
  ]);

  constructor(source: string) {
    this.source = source;
  }

  private peek(offset: number = 0): string {
    const pos = this.pos + offset;
    if (pos >= this.source.length) return "\0";
    return this.source[pos];
  }

  private advance(): string {
    const char = this.source[this.pos];
    this.pos++;
    if (char === "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private skipWhitespace(): void {
    while (this.pos < this.source.length) {
      const char = this.peek();
      if (char === " " || char === "\t" || char === "\r") {
        this.advance();
      } else if (char === "#") {
        // 주석 처리
        while (this.peek() !== "\n" && this.peek() !== "\0") {
          this.advance();
        }
      } else {
        break;
      }
    }
  }

  private readNumber(): Token {
    const line = this.line;
    const column = this.column;
    let numStr = "";

    // 정수 부분
    while (/[0-9]/.test(this.peek())) {
      numStr += this.advance();
    }

    // 소수점 부분
    if (this.peek() === "." && /[0-9]/.test(this.peek(1))) {
      numStr += this.advance(); // 점
      while (/[0-9]/.test(this.peek())) {
        numStr += this.advance();
      }
      return {
        type: TokenType.FLOAT,
        value: parseFloat(numStr),
        line,
        column,
      };
    }

    return {
      type: TokenType.INTEGER,
      value: parseInt(numStr),
      line,
      column,
    };
  }

  private readString(): Token {
    const line = this.line;
    const column = this.column;
    const quote = this.advance(); // " 또는 '
    let str = "";

    while (this.peek() !== quote && this.peek() !== "\0") {
      if (this.peek() === "\\") {
        this.advance();
        const escaped = this.advance();
        switch (escaped) {
          case "n": str += "\n"; break;
          case "t": str += "\t"; break;
          case "r": str += "\r"; break;
          case "\\": str += "\\"; break;
          case '"': str += '"'; break;
          case "'": str += "'"; break;
          default: str += escaped;
        }
      } else {
        str += this.advance();
      }
    }

    if (this.peek() === quote) {
      this.advance(); // 닫는 따옴표
    }

    return {
      type: TokenType.STRING,
      value: str,
      line,
      column,
    };
  }

  private readIdentifier(): Token {
    const line = this.line;
    const column = this.column;
    let ident = "";

    while (/[a-zA-Z0-9_]/.test(this.peek())) {
      ident += this.advance();
    }

    const tokenType = this.keywords.get(ident) || TokenType.IDENTIFIER;
    const value =
      tokenType === TokenType.TRUE
        ? true
        : tokenType === TokenType.FALSE
        ? false
        : ident;

    return {
      type: tokenType,
      value,
      line,
      column,
    };
  }

  public tokenize(): Token[] {
    while (this.pos < this.source.length) {
      this.skipWhitespace();

      if (this.pos >= this.source.length) break;

      const line = this.line;
      const column = this.column;
      const char = this.peek();

      // 개행
      if (char === "\n") {
        this.advance();
        // 선택: 개행 토큰을 포함할지 여부
        continue;
      }

      // 숫자
      if (/[0-9]/.test(char)) {
        this.tokens.push(this.readNumber());
        continue;
      }

      // 문자열
      if (char === '"' || char === "'") {
        this.tokens.push(this.readString());
        continue;
      }

      // 식별자/키워드
      if (/[a-zA-Z_]/.test(char)) {
        this.tokens.push(this.readIdentifier());
        continue;
      }

      // 연산자 및 구분자
      this.advance();

      switch (char) {
        case "+":
          if (this.peek() === "=") {
            this.advance();
            this.tokens.push({
              type: TokenType.PLUS_ASSIGN,
              value: "+=",
              line,
              column,
            });
          } else {
            this.tokens.push({
              type: TokenType.PLUS,
              value: "+",
              line,
              column,
            });
          }
          break;

        case "-":
          if (this.peek() === "=") {
            this.advance();
            this.tokens.push({
              type: TokenType.MINUS_ASSIGN,
              value: "-=",
              line,
              column,
            });
          } else if (this.peek() === ">") {
            this.advance();
            this.tokens.push({
              type: TokenType.ARROW,
              value: "->",
              line,
              column,
            });
          } else {
            this.tokens.push({
              type: TokenType.MINUS,
              value: "-",
              line,
              column,
            });
          }
          break;

        case "*":
          if (this.peek() === "=") {
            this.advance();
            this.tokens.push({
              type: TokenType.STAR_ASSIGN,
              value: "*=",
              line,
              column,
            });
          } else {
            this.tokens.push({
              type: TokenType.STAR,
              value: "*",
              line,
              column,
            });
          }
          break;

        case "/":
          if (this.peek() === "=") {
            this.advance();
            this.tokens.push({
              type: TokenType.SLASH_ASSIGN,
              value: "/=",
              line,
              column,
            });
          } else {
            this.tokens.push({
              type: TokenType.SLASH,
              value: "/",
              line,
              column,
            });
          }
          break;

        case "%":
          this.tokens.push({
            type: TokenType.PERCENT,
            value: "%",
            line,
            column,
          });
          break;

        case "=":
          if (this.peek() === "=") {
            this.advance();
            this.tokens.push({
              type: TokenType.EQ,
              value: "==",
              line,
              column,
            });
          } else if (this.peek() === ">") {
            this.advance();
            this.tokens.push({
              type: TokenType.FAT_ARROW,
              value: "=>",
              line,
              column,
            });
          } else {
            this.tokens.push({
              type: TokenType.ASSIGN,
              value: "=",
              line,
              column,
            });
          }
          break;

        case "!":
          if (this.peek() === "=") {
            this.advance();
            this.tokens.push({
              type: TokenType.NE,
              value: "!=",
              line,
              column,
            });
          } else {
            this.tokens.push({
              type: TokenType.NOT,
              value: "!",
              line,
              column,
            });
          }
          break;

        case "<":
          if (this.peek() === "=") {
            this.advance();
            this.tokens.push({
              type: TokenType.LE,
              value: "<=",
              line,
              column,
            });
          } else {
            this.tokens.push({
              type: TokenType.LT,
              value: "<",
              line,
              column,
            });
          }
          break;

        case ">":
          if (this.peek() === "=") {
            this.advance();
            this.tokens.push({
              type: TokenType.GE,
              value: ">=",
              line,
              column,
            });
          } else {
            this.tokens.push({
              type: TokenType.GT,
              value: ">",
              line,
              column,
            });
          }
          break;

        case "&":
          if (this.peek() === "&") {
            this.advance();
            this.tokens.push({
              type: TokenType.AND,
              value: "&&",
              line,
              column,
            });
          }
          break;

        case "|":
          if (this.peek() === "|") {
            this.advance();
            this.tokens.push({
              type: TokenType.OR,
              value: "||",
              line,
              column,
            });
          }
          break;

        case "(":
          this.tokens.push({
            type: TokenType.LPAREN,
            value: "(",
            line,
            column,
          });
          break;

        case ")":
          this.tokens.push({
            type: TokenType.RPAREN,
            value: ")",
            line,
            column,
          });
          break;

        case "{":
          this.tokens.push({
            type: TokenType.LBRACE,
            value: "{",
            line,
            column,
          });
          break;

        case "}":
          this.tokens.push({
            type: TokenType.RBRACE,
            value: "}",
            line,
            column,
          });
          break;

        case "[":
          this.tokens.push({
            type: TokenType.LBRACK,
            value: "[",
            line,
            column,
          });
          break;

        case "]":
          this.tokens.push({
            type: TokenType.RBRACK,
            value: "]",
            line,
            column,
          });
          break;

        case ",":
          this.tokens.push({
            type: TokenType.COMMA,
            value: ",",
            line,
            column,
          });
          break;

        case ".":
          this.tokens.push({
            type: TokenType.DOT,
            value: ".",
            line,
            column,
          });
          break;

        case ":":
          this.tokens.push({
            type: TokenType.COLON,
            value: ":",
            line,
            column,
          });
          break;

        case ";":
          this.tokens.push({
            type: TokenType.SEMICOLON,
            value: ";",
            line,
            column,
          });
          break;

        case "^":
          this.tokens.push({
            type: TokenType.CARET,
            value: "^",
            line,
            column,
          });
          break;

        case "?":
          this.tokens.push({
            type: TokenType.QUESTION,
            value: "?",
            line,
            column,
          });
          break;
      }
    }

    // EOF 토큰 추가
    this.tokens.push({
      type: TokenType.EOF,
      value: "",
      line: this.line,
      column: this.column,
    });

    return this.tokens;
  }
}
