"""
Mojo Compiler - AST (Abstract Syntax Tree) Definitions
All AST node types for the parser
"""

# Union-like type using enum for type discrimination
struct ASTNode:
    """Base AST node - all nodes have a type field"""
    var node_type: String

    fn __init__(inout self, node_type: String):
        self.node_type = node_type


# ============================================================================
# TOP-LEVEL NODES
# ============================================================================

struct Program:
    """Root node: { type: "Program", items: [...] }"""
    var items: List[String]  # Array of AST nodes (serialized)

    fn __init__(inout self):
        self.items = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"Program\",\"items\":["
        for i in range(self.items.__len__()):
            result += self.items[i]
            if i < self.items.__len__() - 1:
                result += ","
        result += "]}"
        return result


struct FunctionDeclaration:
    """Function: { type: "FunctionDeclaration", name, parameters, returnType, body, ... }"""
    var name: String
    var parameters: List[String]  # Parameter structs serialized
    var return_type: String
    var body: List[String]  # Statement nodes serialized
    var generics: List[String]  # Generic type parameters
    var constraints: List[String]  # Generic constraints
    var line: Int
    var column: Int

    fn __init__(inout self, name: String):
        self.name = name
        self.parameters = List[String]()
        self.return_type = ""
        self.body = List[String]()
        self.generics = List[String]()
        self.constraints = List[String]()
        self.line = 0
        self.column = 0

    fn to_json(self) -> String:
        var result = "{\"type\":\"FunctionDeclaration\","
        result += "\"name\":\"" + self.name + "\","
        result += "\"parameters\":["
        for i in range(self.parameters.__len__()):
            result += self.parameters[i]
            if i < self.parameters.__len__() - 1:
                result += ","
        result += "],"
        result += "\"returnType\":\"" + self.return_type + "\","
        result += "\"body\":["
        for i in range(self.body.__len__()):
            result += self.body[i]
            if i < self.body.__len__() - 1:
                result += ","
        result += "]"
        result += "}"
        return result


struct StructDeclaration:
    """Struct: { type: "StructDeclaration", name, fields }"""
    var name: String
    var fields: List[String]  # Field definitions serialized

    fn __init__(inout self, name: String):
        self.name = name
        self.fields = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"StructDeclaration\",\"name\":\"" + self.name + "\",\"fields\":["
        for i in range(self.fields.__len__()):
            result += self.fields[i]
            if i < self.fields.__len__() - 1:
                result += ","
        result += "]}"
        return result


struct Parameter:
    """Function parameter: { name, type, defaultValue, isVariadic }"""
    var name: String
    var param_type: String
    var default_value: String
    var is_variadic: Bool

    fn __init__(inout self, name: String, param_type: String):
        self.name = name
        self.param_type = param_type
        self.default_value = ""
        self.is_variadic = False

    fn to_json(self) -> String:
        var result = "{\"name\":\"" + self.name + "\",\"type\":\"" + self.param_type + "\""
        if self.default_value:
            result += ",\"defaultValue\":\"" + self.default_value + "\""
        if self.is_variadic:
            result += ",\"isVariadic\":true"
        result += "}"
        return result


# ============================================================================
# STATEMENTS
# ============================================================================

struct VariableDeclaration:
    """let/var: { type: "VariableDeclaration", names, type, initializer }"""
    var names: List[String]
    var type_annotation: String
    var initializer: String  # Expression node serialized

    fn __init__(inout self):
        self.names = List[String]()
        self.type_annotation = ""
        self.initializer = ""

    fn to_json(self) -> String:
        var result = "{\"type\":\"VariableDeclaration\",\"names\":["
        for i in range(self.names.__len__()):
            result += "\"" + self.names[i] + "\""
            if i < self.names.__len__() - 1:
                result += ","
        result += "],\"type\":\"" + self.type_annotation + "\""
        if self.initializer:
            result += ",\"initializer\":" + self.initializer
        result += "}"
        return result


struct ReturnStatement:
    """return: { type: "ReturnStatement", value }"""
    var value: String  # Expression node serialized (or empty)

    fn __init__(inout self):
        self.value = ""

    fn to_json(self) -> String:
        var result = "{\"type\":\"ReturnStatement\""
        if self.value:
            result += ",\"value\":" + self.value
        result += "}"
        return result


struct IfStatement:
    """if/elif/else: { type: "IfStatement", condition, thenBranch, elseBranch }"""
    var condition: String  # Expression node serialized
    var then_branch: List[String]  # Statement nodes serialized
    var else_branch: List[String]  # Statement nodes serialized (or empty)

    fn __init__(inout self):
        self.condition = ""
        self.then_branch = List[String]()
        self.else_branch = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"IfStatement\",\"condition\":" + self.condition + ",\"thenBranch\":["
        for i in range(self.then_branch.__len__()):
            result += self.then_branch[i]
            if i < self.then_branch.__len__() - 1:
                result += ","
        result += "]"
        if self.else_branch.__len__() > 0:
            result += ",\"elseBranch\":["
            for i in range(self.else_branch.__len__()):
                result += self.else_branch[i]
                if i < self.else_branch.__len__() - 1:
                    result += ","
            result += "]"
        result += "}"
        return result


struct ForLoop:
    """for: { type: "ForLoop", variable, iterable, body }"""
    var variable: String
    var iterable: String  # Expression node serialized
    var body: List[String]  # Statement nodes serialized

    fn __init__(inout self):
        self.variable = ""
        self.iterable = ""
        self.body = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"ForLoop\",\"variable\":\"" + self.variable + "\",\"iterable\":" + self.iterable + ",\"body\":["
        for i in range(self.body.__len__()):
            result += self.body[i]
            if i < self.body.__len__() - 1:
                result += ","
        result += "]}"
        return result


struct WhileLoop:
    """while: { type: "WhileLoop", condition, body }"""
    var condition: String  # Expression node serialized
    var body: List[String]  # Statement nodes serialized

    fn __init__(inout self):
        self.condition = ""
        self.body = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"WhileLoop\",\"condition\":" + self.condition + ",\"body\":["
        for i in range(self.body.__len__()):
            result += self.body[i]
            if i < self.body.__len__() - 1:
                result += ","
        result += "]}"
        return result


struct ExpressionStatement:
    """Expression as statement: { type: "ExpressionStatement", expression }"""
    var expression: String  # Expression node serialized

    fn __init__(inout self):
        self.expression = ""

    fn to_json(self) -> String:
        return "{\"type\":\"ExpressionStatement\",\"expression\":" + self.expression + "}"


struct BreakStatement:
    """break: { type: "BreakStatement" }"""

    fn to_json(self) -> String:
        return "{\"type\":\"BreakStatement\"}"


struct ContinueStatement:
    """continue: { type: "ContinueStatement" }"""

    fn to_json(self) -> String:
        return "{\"type\":\"ContinueStatement\"}"


struct Assignment:
    """assignment: { type: "Assignment", left, right }"""
    var left: String  # Expression node serialized
    var right: String  # Expression node serialized

    fn __init__(inout self):
        self.left = ""
        self.right = ""

    fn to_json(self) -> String:
        return "{\"type\":\"Assignment\",\"left\":" + self.left + ",\"right\":" + self.right + "}"


# ============================================================================
# EXPRESSIONS
# ============================================================================

struct BinaryOp:
    """Binary operation: { type: "BinaryOp", operator, left, right }"""
    var operator: String
    var left: String  # Expression node serialized
    var right: String  # Expression node serialized

    fn __init__(inout self, operator: String):
        self.operator = operator
        self.left = ""
        self.right = ""

    fn to_json(self) -> String:
        return "{\"type\":\"BinaryOp\",\"operator\":\"" + self.operator + "\",\"left\":" + self.left + ",\"right\":" + self.right + "}"


struct UnaryOp:
    """Unary operation: { type: "UnaryOp", operator, operand }"""
    var operator: String
    var operand: String  # Expression node serialized

    fn __init__(inout self, operator: String):
        self.operator = operator
        self.operand = ""

    fn to_json(self) -> String:
        return "{\"type\":\"UnaryOp\",\"operator\":\"" + self.operator + "\",\"operand\":" + self.operand + "}"


struct Call:
    """Function call: { type: "Call", function, arguments }"""
    var function: String  # Expression node serialized (usually Identifier)
    var arguments: List[String]  # Expression nodes serialized

    fn __init__(inout self):
        self.function = ""
        self.arguments = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"Call\",\"function\":" + self.function + ",\"arguments\":["
        for i in range(self.arguments.__len__()):
            result += self.arguments[i]
            if i < self.arguments.__len__() - 1:
                result += ","
        result += "]}"
        return result


struct FieldAccess:
    """Field access: { type: "FieldAccess", object, field }"""
    var object: String  # Expression node serialized
    var field: String

    fn __init__(inout self):
        self.object = ""
        self.field = ""

    fn to_json(self) -> String:
        return "{\"type\":\"FieldAccess\",\"object\":" + self.object + ",\"field\":\"" + self.field + "\"}"


struct IndexAccess:
    """Array/index access: { type: "IndexAccess", object, index }"""
    var object: String  # Expression node serialized
    var index: String  # Expression node serialized

    fn __init__(inout self):
        self.object = ""
        self.index = ""

    fn to_json(self) -> String:
        return "{\"type\":\"IndexAccess\",\"object\":" + self.object + ",\"index\":" + self.index + "}"


struct MatchExpression:
    """Pattern matching: { type: "MatchExpression", expression, cases }"""
    var expression: String  # Expression node serialized
    var cases: List[String]  # Match case objects serialized

    fn __init__(inout self):
        self.expression = ""
        self.cases = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"MatchExpression\",\"expression\":" + self.expression + ",\"cases\":["
        for i in range(self.cases.__len__()):
            result += self.cases[i]
            if i < self.cases.__len__() - 1:
                result += ","
        result += "]}"
        return result


# ============================================================================
# LITERALS & IDENTIFIERS
# ============================================================================

struct IntLiteral:
    """Integer literal: { type: "IntLiteral", value }"""
    var value: String  # Stored as string for JSON compatibility

    fn __init__(inout self, value: String):
        self.value = value

    fn to_json(self) -> String:
        return "{\"type\":\"IntLiteral\",\"value\":" + self.value + "}"


struct FloatLiteral:
    """Float literal: { type: "FloatLiteral", value }"""
    var value: String

    fn __init__(inout self, value: String):
        self.value = value

    fn to_json(self) -> String:
        return "{\"type\":\"FloatLiteral\",\"value\":" + self.value + "}"


struct StringLiteral:
    """String literal: { type: "StringLiteral", value }"""
    var value: String

    fn __init__(inout self, value: String):
        self.value = value.replace("\"", "\\\"").replace("\n", "\\n").replace("\t", "\\t")

    fn to_json(self) -> String:
        return "{\"type\":\"StringLiteral\",\"value\":\"" + self.value + "\"}"


struct BoolLiteral:
    """Boolean literal: { type: "BoolLiteral", value }"""
    var value: Bool

    fn __init__(inout self, value: Bool):
        self.value = value

    fn to_json(self) -> String:
        let val_str = "true" if self.value else "false"
        return "{\"type\":\"BoolLiteral\",\"value\":" + val_str + "}"


struct Identifier:
    """Variable/function name: { type: "Identifier", name }"""
    var name: String

    fn __init__(inout self, name: String):
        self.name = name

    fn to_json(self) -> String:
        return "{\"type\":\"Identifier\",\"name\":\"" + self.name + "\"}"


struct ArrayLiteral:
    """Array: { type: "ArrayLiteral", elements }"""
    var elements: List[String]  # Expression nodes serialized

    fn __init__(inout self):
        self.elements = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"ArrayLiteral\",\"elements\":["
        for i in range(self.elements.__len__()):
            result += self.elements[i]
            if i < self.elements.__len__() - 1:
                result += ","
        result += "]}"
        return result


struct TupleLiteral:
    """Tuple: { type: "TupleLiteral", elements }"""
    var elements: List[String]  # Expression nodes serialized

    fn __init__(inout self):
        self.elements = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"TupleLiteral\",\"elements\":["
        for i in range(self.elements.__len__()):
            result += self.elements[i]
            if i < self.elements.__len__() - 1:
                result += ","
        result += "]}"
        return result


struct StructLiteral:
    """Struct instance: { type: "StructLiteral", name, fields }"""
    var name: String
    var fields: List[String]  # Field assignments serialized

    fn __init__(inout self, name: String):
        self.name = name
        self.fields = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"StructLiteral\",\"name\":\"" + self.name + "\",\"fields\":["
        for i in range(self.fields.__len__()):
            result += self.fields[i]
            if i < self.fields.__len__() - 1:
                result += ","
        result += "]}"
        return result


struct TupleUnpacking:
    """Tuple unpacking in assignment: { type: "TupleUnpacking", variables }"""
    var variables: List[String]

    fn __init__(inout self):
        self.variables = List[String]()

    fn to_json(self) -> String:
        var result = "{\"type\":\"TupleUnpacking\",\"variables\":["
        for i in range(self.variables.__len__()):
            result += "\"" + self.variables[i] + "\""
            if i < self.variables.__len__() - 1:
                result += ","
        result += "]}"
        return result


fn main():
    print("╔════════════════════════════════════════════════╗")
    print("║  AST Node Types Defined (26 types)            ║")
    print("╚════════════════════════════════════════════════╝\n")

    # Test: Create a simple AST
    var prog = Program()

    var func = FunctionDeclaration("add")
    func.return_type = "Int"
    var p1 = Parameter("a", "Int")
    func.parameters.append(p1.to_json())
    var p2 = Parameter("b", "Int")
    func.parameters.append(p2.to_json())

    # Create a return statement
    var binop = BinaryOp("+")
    binop.left = "{\"type\":\"Identifier\",\"name\":\"a\"}"
    binop.right = "{\"type\":\"Identifier\",\"name\":\"b\"}"

    var ret = ReturnStatement()
    ret.value = binop.to_json()
    func.body.append(ret.to_json())

    prog.items.append(func.to_json())

    print("Sample Program:")
    print(prog.to_json())
    print("\n✅ AST structure definitions complete")
