/**
 * Mojo Compiler - Lexer with Indentation Support
 * Python 스타일 들여쓰기를 처리합니다
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
  AND: "AND",
  OR: "OR",
  NOT: "NOT",

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
  POWER: "POWER",
  ASSIGN: "ASSIGN",
  PLUS_ASSIGN: "PLUS_ASSIGN",
  MINUS_ASSIGN: "MINUS_ASSIGN",
  STAR_ASSIGN: "STAR_ASSIGN",
  SLASH_ASSIGN: "SLASH_ASSIGN",
  EQ: "EQ",
  NE: "NE",
  LT: "LT",
  LE: "LE",
  GT: "GT",
  GE: "GE",

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

  // Indentation
  INDENT: "INDENT",
  DEDENT: "DEDENT",
  NEWLINE: "NEWLINE",

  // Special
  EOF: "EOF",
};

class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

class IndentationLexer {
  constructor(source) {
    this.source = source;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
    this.indentStack = [0]; // 들여쓰기 스택
    
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
      ["and", TokenType.AND],
      ["or", TokenType.OR],
      ["not", TokenType.NOT],
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

  skipWhitespaceExceptNewline() {
    while (/[ \t]/.test(this.peek())) {
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

  readIndentation() {
    let indent = 0;
    while (this.peek() === " " || this.peek() === "\t") {
      if (this.peek() === "\t") {
        indent += 4; // 탭을 4칸 공백으로 처리
      } else {
        indent += 1;
      }
      this.advance();
    }
    return indent;
  }

  readDocstring() {
    // Skip opening """
    this.advance(); // first "
    this.advance(); // second "
    this.advance(); // third "

    let value = "";
    while (true) {
      if (this.peek() === "\0") break;
      if (this.peek() === '"' && this.peek(1) === '"' && this.peek(2) === '"') {
        this.advance(); // first "
        this.advance(); // second "
        this.advance(); // third "
        break;
      }
      value += this.advance();
    }
    return value;
  }

  readString() {
    const quote = this.advance();
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
      // 라인 시작
      if (this.column === 1) {
        const indent = this.readIndentation();

        // 빈 줄이거나 주석줄이면 무시
        if (this.peek() === "\n" || this.peek() === "#" || this.peek() === "\0") {
          if (this.peek() === "#") {
            this.skipComment();
          }
          if (this.peek() === "\n") {
            this.advance();
          }
          continue;
        }

        // 들여쓰기 토큰 생성
        const currentIndent = this.indentStack[this.indentStack.length - 1];
        if (indent > currentIndent) {
          this.indentStack.push(indent);
          this.tokens.push(new Token(TokenType.INDENT, null, this.line, this.column));
        } else if (indent < currentIndent) {
          while (this.indentStack.length > 1 && this.indentStack[this.indentStack.length - 1] > indent) {
            this.indentStack.pop();
            this.tokens.push(new Token(TokenType.DEDENT, null, this.line, this.column));
          }
        }
      }

      this.skipWhitespaceExceptNewline();
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
      // Strings and Docstrings
      else if (char === '"' || char === "'") {
        // Check for docstring (""" or ''')
        if ((char === '"' && this.peek(1) === '"' && this.peek(2) === '"') ||
            (char === "'" && this.peek(1) === "'" && this.peek(2) === "'")) {
          const string = this.readDocstring();
          this.tokens.push(new Token(TokenType.STRING, string, line, column));
        } else {
          const string = this.readString();
          this.tokens.push(new Token(TokenType.STRING, string, line, column));
        }
      }
      // Identifiers and Keywords
      else if (/[a-zA-Z_]/.test(char)) {
        const identifier = this.readIdentifier();
        const type = this.keywords.has(identifier)
          ? this.keywords.get(identifier)
          : TokenType.IDENTIFIER;
        this.tokens.push(new Token(type, identifier, line, column));
      }
      // Operators
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
        if (this.peek() === "*") {
          this.advance();
          this.tokens.push(new Token(TokenType.POWER, "**", line, column));
        } else if (this.peek() === "=") {
          this.advance();
          this.tokens.push(new Token(TokenType.STAR_ASSIGN, "*=", line, column));
        } else {
          this.tokens.push(new Token(TokenType.STAR, "*", line, column));
        }
      } else if (char === "/") {
        this.advance();
        if (this.peek() === "=") {
          this.advance();
          this.tokens.push(new Token(TokenType.SLASH_ASSIGN, "/=", line, column));
        } else {
          this.tokens.push(new Token(TokenType.SLASH, "/", line, column));
        }
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
      } else if (char === "[") {
        this.advance();
        this.tokens.push(new Token(TokenType.LBRACK, "[", line, column));
      } else if (char === "]") {
        this.advance();
        this.tokens.push(new Token(TokenType.RBRACK, "]", line, column));
      } else if (char === "{") {
        this.advance();
        this.tokens.push(new Token(TokenType.LBRACE, "{", line, column));
      } else if (char === "}") {
        this.advance();
        this.tokens.push(new Token(TokenType.RBRACE, "}", line, column));
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
        this.tokens.push(new Token(TokenType.NEWLINE, "\\n", line, column));
      } else {
        this.advance();
      }
    }

    // 파일 끝에서 모든 DEDENT 토큰 생성
    while (this.indentStack.length > 1) {
      this.indentStack.pop();
      this.tokens.push(new Token(TokenType.DEDENT, null, this.line, this.column));
    }

    this.tokens.push(new Token(TokenType.EOF, null, this.line, this.column));
    return this.tokens;
  }
}

module.exports = { IndentationLexer, Token, TokenType };
