"""
Mojo Compiler - Parser (Indentation-aware)
Converts token stream to AST

Reference: parser-indent.js (982 lines)
Migration: JavaScript → Mojo
"""

from ast import *
from lexer import *


struct ParserIndent:
    """Recursive descent parser with indentation support"""
    var tokens: List[Token]
    var position: Int
    var errors: List[String]
    var indent_stack: List[Int]

    fn __init__(inout self, tokens: List[Token]):
        self.tokens = tokens
        self.position = 0
        self.errors = List[String]()
        self.indent_stack = List[Int]()
        self.indent_stack.append(0)

    # ========================================================================
    # TOKEN STREAM METHODS (5)
    # ========================================================================

    fn peek(self, offset: Int = 0) -> Token:
        """Look at token at position + offset"""
        let pos = self.position + offset
        if pos >= self.tokens.__len__():
            # Return EOF token
            return Token(TokenType.EOF(), "", 0, 0)
        return self.tokens[pos]

    fn advance(inout self) -> Token:
        """Consume current token and move to next"""
        let token = self.peek()
        self.position += 1
        return token

    fn match(self, *types: String) -> Bool:
        """Check if current token matches any of the given types"""
        let current = self.peek()
        for t in types:
            if current.token_type == t:
                return True
        return False

    fn consume(inout self, token_type: String, msg: String) -> Token:
        """Expect a specific token type, error if not found"""
        if not self.match(token_type):
            self.errors.append(msg + " (got " + self.peek().token_type + " at line " + String(self.peek().line) + ")")
            return Token(TokenType.EOF(), "", 0, 0)
        return self.advance()

    fn skip_newlines(inout self):
        """Skip NEWLINE tokens"""
        while self.match(TokenType.NEWLINE()):
            self.advance()

    # ========================================================================
    # MAIN PARSING ENTRY POINT
    # ========================================================================

    fn parseProgram(inout self) -> String:
        """Parse top-level program: function definitions, struct definitions"""
        var program = Program()

        self.skip_newlines()

        while not self.match(TokenType.EOF()):
            if self.match(TokenType.FN(), TokenType.DEF()):
                let func_json = self.parseFunction()
                if func_json:
                    program.items.append(func_json)
            elif self.match(TokenType.STRUCT()):
                let struct_json = self.parseStruct()
                if struct_json:
                    program.items.append(struct_json)
            else:
                self.skip_newlines()
                if not self.match(TokenType.EOF()):
                    self.advance()
            self.skip_newlines()

        return program.to_json()

    # ========================================================================
    # STATEMENT PARSING
    # ========================================================================

    fn parseFunction(inout self) -> String:
        """Parse function definition: fn name(params) -> ReturnType: body"""
        let line = self.peek().line
        let column = self.peek().column

        let is_fn = self.match(TokenType.FN())
        if is_fn:
            self.consume(TokenType.FN(), "Expected 'fn'")
        else:
            self.consume(TokenType.DEF(), "Expected 'def'")

        # Function name
        let name_token = self.peek()
        if name_token.token_type != TokenType.IDENTIFIER():
            self.errors.append("Expected function name")
            return ""
        let name = name_token.value
        self.advance()

        var func = FunctionDeclaration(name)
        func.line = line
        func.column = column

        # Parameters
        if self.match(TokenType.LPAREN()):
            self.advance()
            while not self.match(TokenType.RPAREN()) and not self.match(TokenType.EOF()):
                let param_name = self.peek().value
                self.advance()
                self.consume(TokenType.COLON(), "Expected ':' after parameter name")
                let param_type = self.peek().value
                self.advance()

                var param = Parameter(param_name, param_type)
                func.parameters.append(param.to_json())

                if self.match(TokenType.COMMA()):
                    self.advance()
            self.consume(TokenType.RPAREN(), "Expected ')'")

        # Return type
        if self.match(TokenType.ARROW()):
            self.advance()
            func.return_type = self.peek().value
            self.advance()
        else:
            func.return_type = "void"

        # Body
        self.consume(TokenType.COLON(), "Expected ':' before function body")
        self.skip_newlines()

        if self.match(TokenType.INDENT()):
            self.advance()
            while not self.match(TokenType.DEDENT()) and not self.match(TokenType.EOF()):
                let stmt = self.parseStatement()
                if stmt:
                    func.body.append(stmt)
                self.skip_newlines()
            if self.match(TokenType.DEDENT()):
                self.advance()

        return func.to_json()

    fn parseStruct(inout self) -> String:
        """Parse struct definition: struct Name: fields..."""
        self.consume(TokenType.STRUCT(), "Expected 'struct'")

        let name = self.peek().value
        self.advance()

        var struct_decl = StructDeclaration(name)

        self.consume(TokenType.COLON(), "Expected ':' after struct name")
        self.skip_newlines()

        if self.match(TokenType.INDENT()):
            self.advance()
            while not self.match(TokenType.DEDENT()) and not self.match(TokenType.EOF()):
                let field_name = self.peek().value
                self.advance()
                self.consume(TokenType.COLON(), "Expected ':' after field name")
                let field_type = self.peek().value
                self.advance()

                struct_decl.fields.append("{\"name\":\"" + field_name + "\",\"type\":\"" + field_type + "\"}")
                self.skip_newlines()

            if self.match(TokenType.DEDENT()):
                self.advance()

        return struct_decl.to_json()

    fn parseStatement(inout self) -> String:
        """Parse statement: variable, return, if, for, while, etc."""
        self.skip_newlines()

        if self.match(TokenType.RETURN()):
            return self.parseReturn()
        elif self.match(TokenType.IF()):
            return self.parseIf()
        elif self.match(TokenType.WHILE()):
            return self.parseWhile()
        elif self.match(TokenType.FOR()):
            return self.parseFor()
        elif self.match(TokenType.BREAK()):
            self.advance()
            var break_stmt = BreakStatement()
            return break_stmt.to_json()
        elif self.match(TokenType.CONTINUE()):
            self.advance()
            var continue_stmt = ContinueStatement()
            return continue_stmt.to_json()
        else:
            # Try to parse as expression statement or assignment
            return self.parseExpressionStatement()

    fn parseReturn(inout self) -> String:
        """Parse return statement"""
        self.consume(TokenType.RETURN(), "Expected 'return'")
        var ret = ReturnStatement()

        if not self.match(TokenType.NEWLINE()) and not self.match(TokenType.EOF()) and not self.match(TokenType.DEDENT()):
            ret.value = self.parseExpression()

        return ret.to_json()

    fn parseIf(inout self) -> String:
        """Parse if statement"""
        self.consume(TokenType.IF(), "Expected 'if'")

        var if_stmt = IfStatement()
        if_stmt.condition = self.parseExpression()

        self.consume(TokenType.COLON(), "Expected ':' after if condition")
        self.skip_newlines()

        if self.match(TokenType.INDENT()):
            self.advance()
            while not self.match(TokenType.DEDENT()) and not self.match(TokenType.EOF()):
                let stmt = self.parseStatement()
                if stmt:
                    if_stmt.then_branch.append(stmt)
                self.skip_newlines()
            if self.match(TokenType.DEDENT()):
                self.advance()

        # Handle else/elif
        if self.match(TokenType.ELSE()):
            self.advance()
            self.consume(TokenType.COLON(), "Expected ':' after else")
            self.skip_newlines()

            if self.match(TokenType.INDENT()):
                self.advance()
                while not self.match(TokenType.DEDENT()) and not self.match(TokenType.EOF()):
                    let stmt = self.parseStatement()
                    if stmt:
                        if_stmt.else_branch.append(stmt)
                    self.skip_newlines()
                if self.match(TokenType.DEDENT()):
                    self.advance()

        return if_stmt.to_json()

    fn parseWhile(inout self) -> String:
        """Parse while loop"""
        self.consume(TokenType.WHILE(), "Expected 'while'")

        var while_stmt = WhileLoop()
        while_stmt.condition = self.parseExpression()

        self.consume(TokenType.COLON(), "Expected ':' after while condition")
        self.skip_newlines()

        if self.match(TokenType.INDENT()):
            self.advance()
            while not self.match(TokenType.DEDENT()) and not self.match(TokenType.EOF()):
                let stmt = self.parseStatement()
                if stmt:
                    while_stmt.body.append(stmt)
                self.skip_newlines()
            if self.match(TokenType.DEDENT()):
                self.advance()

        return while_stmt.to_json()

    fn parseFor(inout self) -> String:
        """Parse for loop"""
        self.consume(TokenType.FOR(), "Expected 'for'")

        var for_loop = ForLoop()
        for_loop.variable = self.peek().value
        self.advance()

        self.consume(TokenType.IN(), "Expected 'in'")
        for_loop.iterable = self.parseExpression()

        self.consume(TokenType.COLON(), "Expected ':' after for condition")
        self.skip_newlines()

        if self.match(TokenType.INDENT()):
            self.advance()
            while not self.match(TokenType.DEDENT()) and not self.match(TokenType.EOF()):
                let stmt = self.parseStatement()
                if stmt:
                    for_loop.body.append(stmt)
                self.skip_newlines()
            if self.match(TokenType.DEDENT()):
                self.advance()

        return for_loop.to_json()

    fn parseExpressionStatement(inout self) -> String:
        """Parse expression statement or assignment"""
        let expr = self.parseExpression()

        # Check for assignment
        if self.match(TokenType.ASSIGN(), TokenType.PLUS_ASSIGN(), TokenType.MINUS_ASSIGN()):
            let op = self.peek().token_type
            self.advance()
            let right = self.parseExpression()

            var assignment = Assignment()
            assignment.left = expr
            assignment.right = right

            return assignment.to_json()
        else:
            var expr_stmt = ExpressionStatement()
            expr_stmt.expression = expr
            return expr_stmt.to_json()

    # ========================================================================
    # EXPRESSION PARSING
    # ========================================================================

    fn parseExpression(inout self) -> String:
        """Parse expression with operator precedence"""
        return self.parseBinaryOp(0)

    fn parseBinaryOp(inout self, min_prec: Int) -> String:
        """Parse binary operators with precedence climbing"""
        var left = self.parseUnary()

        while self.isBinaryOperator(self.peek()):
            let op = self.peek().token_type
            let prec = self.getOperatorPrecedence(op)

            if prec < min_prec:
                break

            self.advance()

            let right = self.parseBinaryOp(prec + 1)

            var binop = BinaryOp(op)
            binop.left = left
            binop.right = right
            left = binop.to_json()

        return left

    fn parseUnary(inout self) -> String:
        """Parse unary operators"""
        if self.match(TokenType.NOT(), TokenType.MINUS()):
            let op = self.peek().token_type
            self.advance()
            let operand = self.parseUnary()

            var unop = UnaryOp(op)
            unop.operand = operand
            return unop.to_json()

        return self.parsePostfix()

    fn parsePostfix(inout self) -> String:
        """Parse postfix operations (function calls, field access, indexing)"""
        var expr = self.parsePrimary()

        while True:
            if self.match(TokenType.LPAREN()):
                self.advance()
                var call = Call()
                call.function = expr

                while not self.match(TokenType.RPAREN()) and not self.match(TokenType.EOF()):
                    call.arguments.append(self.parseExpression())
                    if self.match(TokenType.COMMA()):
                        self.advance()

                self.consume(TokenType.RPAREN(), "Expected ')'")
                expr = call.to_json()

            elif self.match(TokenType.DOT()):
                self.advance()
                let field = self.peek().value
                self.advance()

                var field_access = FieldAccess()
                field_access.object = expr
                field_access.field = field
                expr = field_access.to_json()

            elif self.match(TokenType.LBRACK()):
                self.advance()
                let index = self.parseExpression()
                self.consume(TokenType.RBRACK(), "Expected ']'")

                var index_access = IndexAccess()
                index_access.object = expr
                index_access.index = index
                expr = index_access.to_json()

            else:
                break

        return expr

    fn parsePrimary(inout self) -> String:
        """Parse primary expressions (literals, identifiers, etc.)"""
        let token = self.peek()

        if self.match(TokenType.INTEGER()):
            self.advance()
            var lit = IntLiteral(token.value)
            return lit.to_json()

        elif self.match(TokenType.FLOAT()):
            self.advance()
            var lit = FloatLiteral(token.value)
            return lit.to_json()

        elif self.match(TokenType.STRING()):
            self.advance()
            var lit = StringLiteral(token.value)
            return lit.to_json()

        elif self.match(TokenType.TRUE()):
            self.advance()
            var lit = BoolLiteral(True)
            return lit.to_json()

        elif self.match(TokenType.FALSE()):
            self.advance()
            var lit = BoolLiteral(False)
            return lit.to_json()

        elif self.match(TokenType.IDENTIFIER()):
            self.advance()
            var ident = Identifier(token.value)
            return ident.to_json()

        elif self.match(TokenType.LBRACK()):
            return self.parseArrayLiteral()

        elif self.match(TokenType.LPAREN()):
            return self.parseTupleLiteral()

        else:
            self.errors.append("Unexpected token: " + token.token_type)
            return "{\"type\":\"Identifier\",\"name\":\"error\"}"

    fn parseArrayLiteral(inout self) -> String:
        """Parse array literal: [1, 2, 3]"""
        self.consume(TokenType.LBRACK(), "Expected '['")
        var array = ArrayLiteral()

        while not self.match(TokenType.RBRACK()) and not self.match(TokenType.EOF()):
            array.elements.append(self.parseExpression())
            if self.match(TokenType.COMMA()):
                self.advance()

        self.consume(TokenType.RBRACK(), "Expected ']'")
        return array.to_json()

    fn parseTupleLiteral(inout self) -> String:
        """Parse tuple or parenthesized expression"""
        self.consume(TokenType.LPAREN(), "Expected '('")

        if self.match(TokenType.RPAREN()):
            self.advance()
            var empty_tuple = TupleLiteral()
            return empty_tuple.to_json()

        let first = self.parseExpression()

        if self.match(TokenType.COMMA()):
            var tuple = TupleLiteral()
            tuple.elements.append(first)

            while self.match(TokenType.COMMA()):
                self.advance()
                if self.match(TokenType.RPAREN()):
                    break
                tuple.elements.append(self.parseExpression())

            self.consume(TokenType.RPAREN(), "Expected ')'")
            return tuple.to_json()
        else:
            self.consume(TokenType.RPAREN(), "Expected ')'")
            return first

    # ========================================================================
    # HELPER METHODS
    # ========================================================================

    fn getOperatorPrecedence(self, token_type: String) -> Int:
        """Return operator precedence (higher = tighter binding)"""
        if token_type == TokenType.OR():
            return 1
        elif token_type == TokenType.AND():
            return 2
        elif token_type == TokenType.EQ() or token_type == TokenType.NE() or token_type == TokenType.LT() or token_type == TokenType.LE() or token_type == TokenType.GT() or token_type == TokenType.GE():
            return 3
        elif token_type == TokenType.PLUS() or token_type == TokenType.MINUS():
            return 4
        elif token_type == TokenType.STAR() or token_type == TokenType.SLASH() or token_type == TokenType.PERCENT():
            return 5
        elif token_type == TokenType.POWER():
            return 6
        else:
            return 0

    fn isBinaryOperator(self, token: Token) -> Bool:
        """Check if token is a binary operator"""
        let prec = self.getOperatorPrecedence(token.token_type)
        return prec > 0

    fn isUnaryOperator(self, token: Token) -> Bool:
        """Check if token is a unary operator"""
        return token.token_type == TokenType.NOT() or token.token_type == TokenType.MINUS()


fn main():
    print("╔════════════════════════════════════════════════╗")
    print("║  Mojo Parser - Skeleton Complete             ║")
    print("║  Token stream methods: ✅                      ║")
    print("║  parseProgram: ✅                             ║")
    print("║  Statement parsing: ✅                        ║")
    print("║  Expression parsing: ✅                       ║")
    print("╚════════════════════════════════════════════════╝\n")

    print("Ready for Day 2 integration tests")
