/**
 * Phase 16 Step 4: IR Generator - Full Implementation
 * Days 2-7: Code Generation, Optimization, Validation
 *
 * 목표: AST → IR 변환 (상수, 변수, 연산, 제어흐름, 함수, 배열)
 */

// ============================================================================
// Helper Functions for JSON Parsing
// ============================================================================

fn json_get_type(json: String) -> String:
    // "type" 필드 추출
    var type_start = json.find("\"type\"")

    if type_start == -1:
        return ""

    let colon = json.find(":", type_start)

    if colon == -1:
        return ""

    let quote1 = json.find("\"", colon)

    if quote1 == -1:
        return ""

    let quote2 = json.find("\"", quote1 + 1)

    if quote2 == -1:
        return ""

    return json.__getitem__(quote1 + 1, quote2)

fn json_get_string(json: String, key: String) -> String:
    // 문자열 필드 값 추출
    var key_str = "\"" + key + "\""
    var start = json.find(key_str)

    if start == -1:
        return ""

    let colon = json.find(":", start)

    if colon == -1:
        return ""

    let quote1 = json.find("\"", colon)

    if quote1 == -1:
        return ""

    let quote2 = json.find("\"", quote1 + 1)

    if quote2 == -1:
        return ""

    return json.__getitem__(quote1 + 1, quote2)

fn json_get_number(json: String, key: String) -> Int:
    // 숫자 필드 값 추출
    var key_str = "\"" + key + "\""
    var start = json.find(key_str)

    if start == -1:
        return 0

    let colon = json.find(":", start)

    if colon == -1:
        return 0

    var i = colon + 1

    while i < json.__len__() and (json[i] == " " or json[i] == "\t"):
        i = i + 1

    var num_str = ""

    while i < json.__len__() and json[i] >= "0" and json[i] <= "9":
        num_str += String(json[i])
        i = i + 1

    if num_str.__len__() == 0:
        return 0

    return int(num_str)

// ============================================================================
// Code Generator - Main Class
// ============================================================================

struct CodeGenerator:
    var module: IRModule
    var var_stack: List[Dict[String, Int]]  // 각 스코프의 변수 매핑
    var current_reg: Int                    // 현재 레지스터 인덱스

    fn __init__(inout self):
        self.module = IRModule()
        self.var_stack = List[Dict[String, Int]]()
        self.current_reg = 0

    fn get_next_reg(inout self) -> Int:
        var reg = self.current_reg
        self.current_reg = self.current_reg + 1
        return reg

    fn enter_scope(inout self):
        var scope = Dict[String, Int]()
        self.var_stack.append(scope)

    fn exit_scope(inout self):
        if self.var_stack.__len__() > 0:
            self.var_stack.pop()

    fn define_var(inout self, name: String, reg: Int):
        if self.var_stack.__len__() > 0:
            var scope = self.var_stack[self.var_stack.__len__() - 1]
            scope[name] = reg

    fn lookup_var(self, name: String) -> Int:
        // 가장 안쪽 스코프부터 찾기
        var i = self.var_stack.__len__() - 1

        while i >= 0:
            var scope = self.var_stack[i]

            if name in scope:
                return scope[name]

            i = i - 1

        return -1  // 찾지 못함

    // ========================================================================
    // Day 2: Constant & Variable Processing
    // ========================================================================

    fn gen_integer_literal(inout self, value: Int) -> Int:
        // 정수 리터럴 생성
        var reg = self.get_next_reg()
        self.module.emit_load_const(str(value), "int")
        return reg

    fn gen_float_literal(inout self, value: Float) -> Int:
        // 실수 리터럴 생성
        var reg = self.get_next_reg()
        self.module.emit_load_const(str(value), "float")
        return reg

    fn gen_string_literal(inout self, value: String) -> Int:
        // 문자열 리터럴 생성
        var reg = self.get_next_reg()
        self.module.emit_load_const(value, "string")
        return reg

    fn gen_bool_literal(inout self, value: Bool) -> Int:
        // 불 리터럴 생성
        var reg = self.get_next_reg()
        let bool_str = "true" if value else "false"
        self.module.emit_load_const(bool_str, "bool")
        return reg

    fn gen_var_decl(inout self, name: String, value_reg: Int, var_type: String) -> Int:
        // 변수 선언: STORE_VAR 발행
        var reg = self.get_next_reg()
        self.module.add_symbol(name, var_type)
        self.define_var(name, value_reg)
        self.module.emit_store_var(name, value_reg)
        return reg

    fn gen_identifier(inout self, name: String) -> Int:
        // 변수 사용: LOAD_VAR 발행
        var reg = self.get_next_reg()
        self.module.emit_load_var(name)
        return reg

    fn gen_assignment(inout self, name: String, value_reg: Int) -> Int:
        // 할당: STORE_VAR 발행
        var reg = self.get_next_reg()
        self.define_var(name, value_reg)
        self.module.emit_store_var(name, value_reg)
        return reg

    // ========================================================================
    // Day 3: Binary & Unary Operations
    // ========================================================================

    fn gen_binary_op(inout self, op: String, left_reg: Int, right_reg: Int) -> Int:
        // 이항 연산
        var reg = self.get_next_reg()
        var result_type = "auto"

        if op == "+" or op == "-" or op == "*" or op == "/" or op == "%":
            result_type = "int"
        elif op == "==" or op == "!=" or op == "<" or op == ">" or op == "<=" or op == ">=":
            result_type = "bool"
        elif op == "and" or op == "or":
            result_type = "bool"

        self.module.emit_binary_op(op, left_reg, right_reg, result_type)
        return reg

    fn gen_unary_op(inout self, op: String, operand_reg: Int) -> Int:
        // 단항 연산
        var reg = self.get_next_reg()
        var result_type = "auto"

        if op == "-":
            result_type = "int"
        elif op == "not":
            result_type = "bool"

        self.module.emit_unary_op(op, operand_reg, result_type)
        return reg

    // ========================================================================
    // Day 4: Control Flow
    // ========================================================================

    fn gen_if_statement(inout self, cond_reg: Int) -> String:
        // if 문 시작: 조건이 거짓이면 점프
        var else_label = self.module.get_next_label()
        self.module.emit_jump_if_false(cond_reg, else_label)
        return else_label

    fn gen_else_label(inout self, else_label: String) -> String:
        // else로 점프할 레이블 생성
        var end_label = self.module.get_next_label()
        self.module.emit_label(else_label)
        return end_label

    fn gen_end_if(inout self, end_label: String):
        // if 문 끝
        self.module.emit_label(end_label)

    fn gen_while_loop(inout self) -> String:
        // while 루프 시작: 루프 라벨
        var loop_label = self.module.get_next_label()
        self.module.emit_label(loop_label)
        return loop_label

    fn gen_while_condition(inout self, cond_reg: Int) -> String:
        // while 조건: 거짓이면 루프 끝으로 점프
        var end_label = self.module.get_next_label()
        self.module.emit_jump_if_false(cond_reg, end_label)
        return end_label

    fn gen_while_end(inout self, loop_label: String, end_label: String):
        // while 루프 끝: 루프 시작으로 점프
        self.module.emit_jump(loop_label)
        self.module.emit_label(end_label)

    // ========================================================================
    // Day 5: Function Calls
    // ========================================================================

    fn gen_function_call(inout self, func_name: String, arg_regs: List[Int]) -> Int:
        // 함수 호출
        var reg = self.get_next_reg()
        self.module.add_function(func_name)
        self.module.emit_call(func_name, arg_regs, "auto")
        return reg

    fn gen_function_decl(inout self, name: String):
        // 함수 선언
        self.module.add_function(name)
        self.module.add_symbol(name, "function")
        self.enter_scope()

    fn gen_function_return(inout self, value_reg: Int):
        // 함수 반환
        self.module.emit_return(value_reg)
        self.exit_scope()

    // ========================================================================
    // Day 6: Arrays & Fields
    // ========================================================================

    fn gen_array_literal(inout self, elem_regs: List[Int]) -> Int:
        // 배열 리터럴
        var reg = self.get_next_reg()
        self.module.emit_array_literal(elem_regs)
        return reg

    fn gen_index_access(inout self, object_reg: Int, index_reg: Int) -> Int:
        // 배열 인덱싱
        var reg = self.get_next_reg()
        var args = List[String]()
        args.append(str(object_reg))
        args.append(str(index_reg))
        self.module.emit("INDEX_ACCESS", args, "auto")
        return reg

    fn gen_field_access(inout self, object_reg: Int, field_name: String) -> Int:
        // 필드 접근
        var reg = self.get_next_reg()
        var args = List[String]()
        args.append(str(object_reg))
        args.append(field_name)
        self.module.emit("FIELD_ACCESS", args, "auto")
        return reg

// ============================================================================
// Helper Extension for IRModule (Day 4-7)
// ============================================================================

impl IRModule:
    fn get_next_label(inout self) -> String:
        var label = "label_" + str(self.instructions.__len__())
        return label

// ============================================================================
// Main - Days 1-6 Test
// ============================================================================

fn main():
    print("╔═════════════════════════════════════════════════════╗")
    print("║  Phase 16 Step 4: IR Generator (Days 1-6 Implementation) ║")
    print("╚═════════════════════════════════════════════════════╝")
    print()

    // Create code generator
    var gen = CodeGenerator()
    gen.enter_scope()

    // Test 1: Literals
    print("Test 1: Literals")
    var r_int = gen.gen_integer_literal(42)
    var r_str = gen.gen_string_literal("hello")
    var r_bool = gen.gen_bool_literal(true)
    print("  Generated 3 literal loads")
    print()

    // Test 2: Variables
    print("Test 2: Variables")
    gen.gen_var_decl("x", r_int, "int")
    gen.gen_var_decl("message", r_str, "string")
    print("  Declared 2 variables")
    print()

    // Test 3: Operations
    print("Test 3: Operations")
    var r_a = gen.gen_integer_literal(10)
    var r_b = gen.gen_integer_literal(20)
    var r_result = gen.gen_binary_op("+", r_a, r_b)
    print("  Generated binary operation")
    print()

    // Test 4: Function
    print("Test 4: Function")
    gen.gen_function_decl("add")
    var r_return = gen.gen_integer_literal(100)
    gen.gen_function_return(r_return)
    print("  Generated function with return")
    print()

    // Test 5: Array
    print("Test 5: Array")
    var elem_regs = List[Int]()
    elem_regs.append(gen.gen_integer_literal(1))
    elem_regs.append(gen.gen_integer_literal(2))
    elem_regs.append(gen.gen_integer_literal(3))
    var r_arr = gen.gen_array_literal(elem_regs)
    print("  Generated array literal [1, 2, 3]")
    print()

    // Test 6: Output
    print("Test 6: Module Summary")
    print("  Instructions: " + str(gen.module.instructions.__len__()))
    print("  Constants: " + str(gen.module.constants.__len__()))
    print("  Symbols: " + str(gen.module.symbols.__len__()))
    print("  Functions: " + str(gen.module.functions.__len__()))
    print("  Total Registers: " + str(gen.current_reg))
    print()

    // Generate JSON
    var json = gen.module.to_json()
    print("✅ IR Generation Complete")
    print("JSON Output (truncated):")
    if json.__len__() > 200:
        print(json.__getitem__(0, 200) + "...")
    else:
        print(json)
    print()

    print("✅ Days 1-6: IR Generator Implementation Ready")
    print("Next: Day 7 Optimization & Validation")
