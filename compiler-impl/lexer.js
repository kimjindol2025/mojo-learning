/**
 * Mojo Compiler - Lexer Phase (JavaScript)
 * 역할: 소스 파일 → 토큰 스트림 변환
 */

const TokenType = {
  // Keywords
  FN: "FN",
  LET: "LET",
  VAR: "VAR",
  IF: "IF",
  ELSE: "ELSE",
  ELIF: "ELIF",
  FOR: "FOR",
  WHILE: "WHILE",
  RETURN: "RETURN",
  STRUCT: "STRUCT",
  OWNED: "OWNED",
  BORROWED: "BORROWED",
  MUT: "MUT",
  MATCH: "MATCH",
  BREAK: "BREAK",
  CONTINUE: "CONTINUE",
  IN: "IN",
  TRUE: "TRUE",
  FALSE: "FALSE",
  DEF: "DEF",

  // Literals
  INTEGER: "INTEGER",
  FLOAT: "FLOAT",
  STRING: "STRING",
  IDENTIFIER: "IDENTIFIER",

  // Operators
  PLUS: "PLUS",
  MINUS: "MINUS",
  STAR: "STAR",
  SLASH: "SLASH",
  PERCENT: "PERCENT",
  ASSIGN: "ASSIGN",
  PLUS_ASSIGN: "PLUS_ASSIGN",
  MINUS_ASSIGN: "MINUS_ASSIGN",
  EQ: "EQ",
  NE: "NE",
  LT: "LT",
  LE: "LE",
  GT: "GT",
  GE: "GE",
  AND: "AND",
  OR: "OR",
  NOT: "NOT",

  // Delimiters
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",
  LBRACE: "LBRACE",
  RBRACE: "RBRACE",
  LBRACK: "LBRACK",
  RBRACK: "RBRACK",
  COMMA: "COMMA",
  DOT: "DOT",
  COLON: "COLON",
  SEMICOLON: "SEMICOLON",
  ARROW: "ARROW",
  FAT_ARROW: "FAT_ARROW",

  // Special
  EOF: "EOF",
  NEWLINE: "NEWLINE",
};

class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

class Lexer {
  constructor(source) {
    this.source = source;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
    
    this.keywords = new Map([
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
      ["def", TokenType.DEF],
    ]);
  }

  peek(offset = 0) {
    const pos = this.position + offset;
    if (pos >= this.source.length) return "\0";
    return this.source[pos];
  }

  advance() {
    const char = this.peek();
    this.position++;
    if (char === "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  skipWhitespace() {
    while (/\s/.test(this.peek()) && this.peek() !== "\n") {
      this.advance();
    }
  }

  skipComment() {
    if (this.peek() === "#") {
      while (this.peek() !== "\n" && this.peek() !== "\0") {
        this.advance();
      }
    }
  }

  readString() {
    const quote = this.advance(); // " 또는 '
    let value = "";
    while (this.peek() !== quote && this.peek() !== "\0") {
      if (this.peek() === "\\") {
        this.advance();
        const next = this.advance();
        value += next === "n" ? "\n" : next === "t" ? "\t" : next;
      } else {
        value += this.advance();
      }
    }
    if (this.peek() === quote) this.advance();
    return value;
  }

  readNumber() {
    let value = "";
    let isFloat = false;

    while (/[0-9.]/.test(this.peek())) {
      if (this.peek() === ".") {
        if (isFloat) break;
        isFloat = true;
      }
      value += this.advance();
    }

    return isFloat ? parseFloat(value) : parseInt(value);
  }

  readIdentifier() {
    let value = "";
    while (/[a-zA-Z0-9_]/.test(this.peek())) {
      value += this.advance();
    }
    return value;
  }

  tokenize() {
    while (this.position < this.source.length) {
      this.skipWhitespace();
      this.skipComment();

      if (this.position >= this.source.length) break;

      const char = this.peek();
      const line = this.line;
      const column = this.column;

      // Numbers
      if (/[0-9]/.test(char)) {
        const number = this.readNumber();
        const type = Number.isInteger(number)
          ? TokenType.INTEGER
          : TokenType.FLOAT;
        this.tokens.push(new Token(type, number, line, column));
      }
      // Strings
      else if (char === '"' || char === "'") {
        const string = this.readString();
        this.tokens.push(new Token(TokenType.STRING, string, line, column));
      }
      // Identifiers and Keywords
      else if (/[a-zA-Z_]/.test(char)) {
        const identifier = this.readIdentifier();
        const type = this.keywords.has(identifier)
          ? this.keywords.get(identifier)
          : TokenType.IDENTIFIER;
        this.tokens.push(new Token(type, identifier, line, column));
      }
      // Operators and Delimiters
      else if (char === "+") {
        this.advance();
        if (this.peek() === "=") {
          this.advance();
          this.tokens.push(new Token(TokenType.PLUS_ASSIGN, "+=", line, column));
        } else {
          this.tokens.push(new Token(TokenType.PLUS, "+", line, column));
        }
      } else if (char === "-") {
        this.advance();
        if (this.peek() === "=") {
          this.advance();
          this.tokens.push(new Token(TokenType.MINUS_ASSIGN, "-=", line, column));
        } else if (this.peek() === ">") {
          this.advance();
          this.tokens.push(new Token(TokenType.ARROW, "->", line, column));
        } else {
          this.tokens.push(new Token(TokenType.MINUS, "-", line, column));
        }
      } else if (char === "*") {
        this.advance();
        this.tokens.push(new Token(TokenType.STAR, "*", line, column));
      } else if (char === "/") {
        this.advance();
        this.tokens.push(new Token(TokenType.SLASH, "/", line, column));
      } else if (char === "%") {
        this.advance();
        this.tokens.push(new Token(TokenType.PERCENT, "%", line, column));
      } else if (char === "=") {
        this.advance();
        if (this.peek() === "=") {
          this.advance();
          this.tokens.push(new Token(TokenType.EQ, "==", line, column));
        } else if (this.peek() === ">") {
          this.advance();
          this.tokens.push(new Token(TokenType.FAT_ARROW, "=>", line, column));
        } else {
          this.tokens.push(new Token(TokenType.ASSIGN, "=", line, column));
        }
      } else if (char === "!") {
        this.advance();
        if (this.peek() === "=") {
          this.advance();
          this.tokens.push(new Token(TokenType.NE, "!=", line, column));
        } else {
          this.tokens.push(new Token(TokenType.NOT, "!", line, column));
        }
      } else if (char === "<") {
        this.advance();
        if (this.peek() === "=") {
          this.advance();
          this.tokens.push(new Token(TokenType.LE, "<=", line, column));
        } else {
          this.tokens.push(new Token(TokenType.LT, "<", line, column));
        }
      } else if (char === ">") {
        this.advance();
        if (this.peek() === "=") {
          this.advance();
          this.tokens.push(new Token(TokenType.GE, ">=", line, column));
        } else {
          this.tokens.push(new Token(TokenType.GT, ">", line, column));
        }
      } else if (char === "&") {
        this.advance();
        if (this.peek() === "&") {
          this.advance();
          this.tokens.push(new Token(TokenType.AND, "&&", line, column));
        }
      } else if (char === "|") {
        this.advance();
        if (this.peek() === "|") {
          this.advance();
          this.tokens.push(new Token(TokenType.OR, "||", line, column));
        }
      } else if (char === "(") {
        this.advance();
        this.tokens.push(new Token(TokenType.LPAREN, "(", line, column));
      } else if (char === ")") {
        this.advance();
        this.tokens.push(new Token(TokenType.RPAREN, ")", line, column));
      } else if (char === "{") {
        this.advance();
        this.tokens.push(new Token(TokenType.LBRACE, "{", line, column));
      } else if (char === "}") {
        this.advance();
        this.tokens.push(new Token(TokenType.RBRACE, "}", line, column));
      } else if (char === "[") {
        this.advance();
        this.tokens.push(new Token(TokenType.LBRACK, "[", line, column));
      } else if (char === "]") {
        this.advance();
        this.tokens.push(new Token(TokenType.RBRACK, "]", line, column));
      } else if (char === ",") {
        this.advance();
        this.tokens.push(new Token(TokenType.COMMA, ",", line, column));
      } else if (char === ".") {
        this.advance();
        this.tokens.push(new Token(TokenType.DOT, ".", line, column));
      } else if (char === ":") {
        this.advance();
        this.tokens.push(new Token(TokenType.COLON, ":", line, column));
      } else if (char === ";") {
        this.advance();
        this.tokens.push(new Token(TokenType.SEMICOLON, ";", line, column));
      } else if (char === "\n") {
        this.advance();
        // NEWLINE 토큰은 선택사항
      } else {
        this.advance();
      }
    }

    this.tokens.push(new Token(TokenType.EOF, null, this.line, this.column));
    return this.tokens;
  }
}

module.exports = { Lexer, Token, TokenType };
