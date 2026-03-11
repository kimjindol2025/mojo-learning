"""
Mojo Compiler - Lexer with Indentation Support
Python 스타일 들여쓰기를 처리합니다
"""

struct TokenType:
    @staticmethod
    fn FN() -> String: return "FN"
    @staticmethod
    fn LET() -> String: return "LET"
    @staticmethod
    fn VAR() -> String: return "VAR"
    @staticmethod
    fn IF() -> String: return "IF"
    @staticmethod
    fn ELSE() -> String: return "ELSE"
    @staticmethod
    fn ELIF() -> String: return "ELIF"
    @staticmethod
    fn FOR() -> String: return "FOR"
    @staticmethod
    fn WHILE() -> String: return "WHILE"
    @staticmethod
    fn RETURN() -> String: return "RETURN"
    @staticmethod
    fn STRUCT() -> String: return "STRUCT"
    @staticmethod
    fn OWNED() -> String: return "OWNED"
    @staticmethod
    fn BORROWED() -> String: return "BORROWED"
    @staticmethod
    fn MUT() -> String: return "MUT"
    @staticmethod
    fn MATCH() -> String: return "MATCH"
    @staticmethod
    fn BREAK() -> String: return "BREAK"
    @staticmethod
    fn CONTINUE() -> String: return "CONTINUE"
    @staticmethod
    fn IN() -> String: return "IN"
    @staticmethod
    fn TRUE() -> String: return "TRUE"
    @staticmethod
    fn FALSE() -> String: return "FALSE"
    @staticmethod
    fn DEF() -> String: return "DEF"
    @staticmethod
    fn AND() -> String: return "AND"
    @staticmethod
    fn OR() -> String: return "OR"
    @staticmethod
    fn NOT() -> String: return "NOT"

    # Literals
    @staticmethod
    fn INTEGER() -> String: return "INTEGER"
    @staticmethod
    fn FLOAT() -> String: return "FLOAT"
    @staticmethod
    fn STRING() -> String: return "STRING"
    @staticmethod
    fn IDENTIFIER() -> String: return "IDENTIFIER"

    # Operators
    @staticmethod
    fn PLUS() -> String: return "PLUS"
    @staticmethod
    fn MINUS() -> String: return "MINUS"
    @staticmethod
    fn STAR() -> String: return "STAR"
    @staticmethod
    fn SLASH() -> String: return "SLASH"
    @staticmethod
    fn PERCENT() -> String: return "PERCENT"
    @staticmethod
    fn POWER() -> String: return "POWER"
    @staticmethod
    fn ASSIGN() -> String: return "ASSIGN"
    @staticmethod
    fn PLUS_ASSIGN() -> String: return "PLUS_ASSIGN"
    @staticmethod
    fn MINUS_ASSIGN() -> String: return "MINUS_ASSIGN"
    @staticmethod
    fn STAR_ASSIGN() -> String: return "STAR_ASSIGN"
    @staticmethod
    fn SLASH_ASSIGN() -> String: return "SLASH_ASSIGN"
    @staticmethod
    fn EQ() -> String: return "EQ"
    @staticmethod
    fn NE() -> String: return "NE"
    @staticmethod
    fn LT() -> String: return "LT"
    @staticmethod
    fn LE() -> String: return "LE"
    @staticmethod
    fn GT() -> String: return "GT"
    @staticmethod
    fn GE() -> String: return "GE"

    # Delimiters
    @staticmethod
    fn LPAREN() -> String: return "LPAREN"
    @staticmethod
    fn RPAREN() -> String: return "RPAREN"
    @staticmethod
    fn LBRACE() -> String: return "LBRACE"
    @staticmethod
    fn RBRACE() -> String: return "RBRACE"
    @staticmethod
    fn LBRACK() -> String: return "LBRACK"
    @staticmethod
    fn RBRACK() -> String: return "RBRACK"
    @staticmethod
    fn COMMA() -> String: return "COMMA"
    @staticmethod
    fn DOT() -> String: return "DOT"
    @staticmethod
    fn COLON() -> String: return "COLON"
    @staticmethod
    fn SEMICOLON() -> String: return "SEMICOLON"
    @staticmethod
    fn ARROW() -> String: return "ARROW"
    @staticmethod
    fn FAT_ARROW() -> String: return "FAT_ARROW"

    # Indentation
    @staticmethod
    fn INDENT() -> String: return "INDENT"
    @staticmethod
    fn DEDENT() -> String: return "DEDENT"
    @staticmethod
    fn NEWLINE() -> String: return "NEWLINE"

    # Special
    @staticmethod
    fn EOF() -> String: return "EOF"


struct Token:
    var token_type: String
    var value: String
    var line: Int
    var column: Int

    fn __init__(inout self, token_type: String, value: String, line: Int, column: Int):
        self.token_type = token_type
        self.value = value
        self.line = line
        self.column = column

    fn to_json(self) -> String:
        let safe_value = self.value.replace("\"", "\\\"").replace("\n", "\\n").replace("\t", "\\t")
        return "{\"type\":\"" + self.token_type + "\",\"value\":\"" + safe_value + "\",\"line\":" + String(self.line) + ",\"column\":" + String(self.column) + "}"


struct IndentationLexer:
    var source: String
    var position: Int
    var line: Int
    var column: Int
    var tokens: List[Token]
    var indent_stack: List[Int]
    var keywords: Dict[String, String]

    fn __init__(inout self, source: String):
        self.source = source
        self.position = 0
        self.line = 1
        self.column = 1
        self.tokens = List[Token]()
        self.indent_stack = List[Int]()
        self.indent_stack.append(0)
        self.keywords = Dict[String, String]()

        # Initialize keywords
        self.keywords["fn"] = TokenType.FN()
        self.keywords["let"] = TokenType.LET()
        self.keywords["var"] = TokenType.VAR()
        self.keywords["if"] = TokenType.IF()
        self.keywords["else"] = TokenType.ELSE()
        self.keywords["elif"] = TokenType.ELIF()
        self.keywords["for"] = TokenType.FOR()
        self.keywords["while"] = TokenType.WHILE()
        self.keywords["return"] = TokenType.RETURN()
        self.keywords["struct"] = TokenType.STRUCT()
        self.keywords["owned"] = TokenType.OWNED()
        self.keywords["borrowed"] = TokenType.BORROWED()
        self.keywords["mut"] = TokenType.MUT()
        self.keywords["match"] = TokenType.MATCH()
        self.keywords["break"] = TokenType.BREAK()
        self.keywords["continue"] = TokenType.CONTINUE()
        self.keywords["in"] = TokenType.IN()
        self.keywords["true"] = TokenType.TRUE()
        self.keywords["false"] = TokenType.FALSE()
        self.keywords["def"] = TokenType.DEF()
        self.keywords["and"] = TokenType.AND()
        self.keywords["or"] = TokenType.OR()
        self.keywords["not"] = TokenType.NOT()

    fn peek(self, offset: Int = 0) -> String:
        let pos = self.position + offset
        if pos >= self.source.__len__():
            return "\0"
        return self.source[pos:pos+1]

    fn advance(inout self) -> String:
        let char = self.peek()
        self.position += 1
        if char == "\n":
            self.line += 1
            self.column = 1
        else:
            self.column += 1
        return char

    fn is_whitespace(self, char: String) -> Bool:
        return char == " " or char == "\t"

    fn is_digit(self, char: String) -> Bool:
        return char >= "0" and char <= "9"

    fn is_alpha(self, char: String) -> Bool:
        return (char >= "a" and char <= "z") or (char >= "A" and char <= "Z") or char == "_"

    fn is_alnum(self, char: String) -> Bool:
        return self.is_alpha(char) or self.is_digit(char)

    fn skip_whitespace_except_newline(inout self):
        while self.is_whitespace(self.peek()):
            self.advance()

    fn skip_comment(inout self):
        if self.peek() == "#":
            while self.peek() != "\n" and self.peek() != "\0":
                self.advance()

    fn read_indentation(inout self) -> Int:
        var indent = 0
        while self.peek() == " " or self.peek() == "\t":
            if self.peek() == "\t":
                indent += 4
            else:
                indent += 1
            self.advance()
        return indent

    fn read_docstring(inout self) -> String:
        # Skip opening """
        self.advance()
        self.advance()
        self.advance()

        var value = ""
        while True:
            if self.peek() == "\0":
                break
            if self.peek() == "\"" and self.peek(1) == "\"" and self.peek(2) == "\"":
                self.advance()
                self.advance()
                self.advance()
                break
            value += self.advance()
        return value

    fn read_string(inout self) -> String:
        let quote = self.advance()
        var value = ""
        while self.peek() != quote and self.peek() != "\0":
            if self.peek() == "\\":
                self.advance()
                let next = self.advance()
                if next == "n":
                    value += "\n"
                elif next == "t":
                    value += "\t"
                else:
                    value += next
            else:
                value += self.advance()
        if self.peek() == quote:
            self.advance()
        return value

    fn read_number(inout self) -> String:
        var value = ""
        var is_float = False
        while self.is_digit(self.peek()) or self.peek() == ".":
            if self.peek() == ".":
                if is_float:
                    break
                is_float = True
            value += self.advance()
        return value

    fn read_identifier(inout self) -> String:
        var value = ""
        while self.is_alpha(self.peek()) or self.is_digit(self.peek()):
            value += self.advance()
        return value

    fn tokenize(inout self) -> List[Token]:
        while self.position < self.source.__len__():
            # Handle line start indentation
            if self.column == 1:
                let indent = self.read_indentation()

                # Skip empty lines and comment lines
                if self.peek() == "\n" or self.peek() == "#" or self.peek() == "\0":
                    if self.peek() == "#":
                        self.skip_comment()
                    if self.peek() == "\n":
                        self.advance()
                    continue

                # Generate indent/dedent tokens
                let current_indent = self.indent_stack[self.indent_stack.__len__() - 1]
                if indent > current_indent:
                    self.indent_stack.append(indent)
                    self.tokens.append(Token(TokenType.INDENT(), "", self.line, self.column))
                elif indent < current_indent:
                    while self.indent_stack.__len__() > 1 and self.indent_stack[self.indent_stack.__len__() - 1] > indent:
                        self.indent_stack.pop()
                        self.tokens.append(Token(TokenType.DEDENT(), "", self.line, self.column))

            self.skip_whitespace_except_newline()
            self.skip_comment()

            if self.position >= self.source.__len__():
                break

            let char = self.peek()
            let line = self.line
            let column = self.column

            # Numbers
            if self.is_digit(char):
                let number_str = self.read_number()
                let token_type = TokenType.INTEGER() if "." not in number_str else TokenType.FLOAT()
                self.tokens.append(Token(token_type, number_str, line, column))

            # Strings and Docstrings
            elif char == "\"" or char == "'":
                if (char == "\"" and self.peek(1) == "\"" and self.peek(2) == "\"") or \
                   (char == "'" and self.peek(1) == "'" and self.peek(2) == "'"):
                    let string = self.read_docstring()
                    self.tokens.append(Token(TokenType.STRING(), string, line, column))
                else:
                    let string = self.read_string()
                    self.tokens.append(Token(TokenType.STRING(), string, line, column))

            # Identifiers and Keywords
            elif self.is_alpha(char):
                let identifier = self.read_identifier()
                let token_type = self.keywords.get(identifier, TokenType.IDENTIFIER())
                self.tokens.append(Token(token_type, identifier, line, column))

            # Operators and Punctuation
            elif char == "+":
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    self.tokens.append(Token(TokenType.PLUS_ASSIGN(), "+=", line, column))
                else:
                    self.tokens.append(Token(TokenType.PLUS(), "+", line, column))

            elif char == "-":
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    self.tokens.append(Token(TokenType.MINUS_ASSIGN(), "-=", line, column))
                elif self.peek() == ">":
                    self.advance()
                    self.tokens.append(Token(TokenType.ARROW(), "->", line, column))
                else:
                    self.tokens.append(Token(TokenType.MINUS(), "-", line, column))

            elif char == "*":
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    self.tokens.append(Token(TokenType.STAR_ASSIGN(), "*=", line, column))
                elif self.peek() == "*":
                    self.advance()
                    self.tokens.append(Token(TokenType.POWER(), "**", line, column))
                else:
                    self.tokens.append(Token(TokenType.STAR(), "*", line, column))

            elif char == "/":
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    self.tokens.append(Token(TokenType.SLASH_ASSIGN(), "/=", line, column))
                else:
                    self.tokens.append(Token(TokenType.SLASH(), "/", line, column))

            elif char == "%":
                self.advance()
                self.tokens.append(Token(TokenType.PERCENT(), "%", line, column))

            elif char == "=":
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    self.tokens.append(Token(TokenType.EQ(), "==", line, column))
                elif self.peek() == ">":
                    self.advance()
                    self.tokens.append(Token(TokenType.FAT_ARROW(), "=>", line, column))
                else:
                    self.tokens.append(Token(TokenType.ASSIGN(), "=", line, column))

            elif char == "!":
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    self.tokens.append(Token(TokenType.NE(), "!=", line, column))
                else:
                    self.tokens.append(Token(TokenType.NOT(), "!", line, column))

            elif char == "<":
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    self.tokens.append(Token(TokenType.LE(), "<=", line, column))
                else:
                    self.tokens.append(Token(TokenType.LT(), "<", line, column))

            elif char == ">":
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    self.tokens.append(Token(TokenType.GE(), ">=", line, column))
                else:
                    self.tokens.append(Token(TokenType.GT(), ">", line, column))

            elif char == "(":
                self.advance()
                self.tokens.append(Token(TokenType.LPAREN(), "(", line, column))

            elif char == ")":
                self.advance()
                self.tokens.append(Token(TokenType.RPAREN(), ")", line, column))

            elif char == "{":
                self.advance()
                self.tokens.append(Token(TokenType.LBRACE(), "{", line, column))

            elif char == "}":
                self.advance()
                self.tokens.append(Token(TokenType.RBRACE(), "}", line, column))

            elif char == "[":
                self.advance()
                self.tokens.append(Token(TokenType.LBRACK(), "[", line, column))

            elif char == "]":
                self.advance()
                self.tokens.append(Token(TokenType.RBRACK(), "]", line, column))

            elif char == ",":
                self.advance()
                self.tokens.append(Token(TokenType.COMMA(), ",", line, column))

            elif char == ".":
                self.advance()
                self.tokens.append(Token(TokenType.DOT(), ".", line, column))

            elif char == ":":
                self.advance()
                self.tokens.append(Token(TokenType.COLON(), ":", line, column))

            elif char == ";":
                self.advance()
                self.tokens.append(Token(TokenType.SEMICOLON(), ";", line, column))

            elif char == "\n":
                self.advance()
                self.tokens.append(Token(TokenType.NEWLINE(), "\n", line, column))

            else:
                # Unknown character, skip it
                self.advance()

        # Add final DEDENTs
        while self.indent_stack.__len__() > 1:
            self.indent_stack.pop()
            self.tokens.append(Token(TokenType.DEDENT(), "", self.line, self.column))

        # Add EOF token
        self.tokens.append(Token(TokenType.EOF(), "", self.line, self.column))

        return self.tokens


fn main():
    # Test lexer
    let test_code = """
fn add(a: Int, b: Int) -> Int:
    return a + b

fn main():
    x = 5
    y = 10
    result = add(x, y)
"""

    var lexer = IndentationLexer(test_code)
    let tokens = lexer.tokenize()

    print("[")
    for i in range(tokens.__len__()):
        print(tokens[i].to_json(), end="")
        if i < tokens.__len__() - 1:
            print(",")
    print("\n]")
