/**
 * Phase 16 Step 4: IR Generator - Core IR Structures
 * Day 1: IR 구조 설계 (IR Module, Instruction, IRGenerator)
 *
 * 목표: Semantic Analyzer 출력을 받아 중간 표현(IR)으로 변환
 * 입력: AST (JSON format)
 * 출력: IR Code (IR instructions + constants + symbols)
 */

// ============================================================================
// IR Instruction 정의
// ============================================================================

struct Instruction:
    var op: String           // Opcode (LOAD_CONST, BINARY_OP, etc.)
    var args: List[String]   // 인자 (타입에 따라 다름)
    var type: String         // 연산 결과 타입 ("int", "float", "string", etc.)
    var line: Int            // 소스 코드 라인 번호

    fn __init__(inout self):
        self.op = ""
        self.args = List[String]()
        self.type = "auto"
        self.line = 0

    fn __init__(inout self, op: String, args: List[String], result_type: String, line: Int):
        self.op = op
        self.args = args
        self.type = result_type
        self.line = line

    fn to_json(self) -> String:
        var json = "{"
        json += "\"op\":\"" + self.op + "\""
        json += ",\"args\":["

        for i in range(self.args.__len__()):
            json += "\"" + self.args[i] + "\""
            if i < self.args.__len__() - 1:
                json += ","

        json += "]"
        json += ",\"type\":\"" + self.type + "\""
        json += ",\"line\":" + str(self.line)
        json += "}"

        return json

// ============================================================================
// IR Module 정의
// ============================================================================

struct IRModule:
    var instructions: List[Instruction]      // IR 명령어 목록
    var constants: List[String]              // 상수풀 (10, 3.14, "hello", etc.)
    var symbols: List[String]                // 심볼 이름들
    var symbol_types: List[String]           // 각 심볼의 타입
    var functions: List[String]              // 함수 이름들
    var globals: List[String]                // 전역 변수들

    fn __init__(inout self):
        self.instructions = List[Instruction]()
        self.constants = List[String]()
        self.symbols = List[String]()
        self.symbol_types = List[String]()
        self.functions = List[String]()
        self.globals = List[String]()

    fn add_instruction(inout self, instr: Instruction):
        self.instructions.append(instr)

    fn add_constant(inout self, value: String) -> Int:
        // 상수풀에 추가하고 인덱스 반환
        var idx = 0

        // 중복 확인
        for i in range(self.constants.__len__()):
            if self.constants[i] == value:
                return i

        // 새로운 상수 추가
        idx = self.constants.__len__()
        self.constants.append(value)
        return idx

    fn add_symbol(inout self, name: String, sym_type: String):
        // 심볼 추가 (중복 확인)
        for i in range(self.symbols.__len__()):
            if self.symbols[i] == name:
                return  // 이미 존재

        self.symbols.append(name)
        self.symbol_types.append(sym_type)

    fn add_function(inout self, name: String):
        self.functions.append(name)

    fn add_global(inout self, name: String):
        self.globals.append(name)

    fn to_json(self) -> String:
        var json = "{"

        // Instructions
        json += "\"instructions\":["
        for i in range(self.instructions.__len__()):
            json += self.instructions[i].to_json()
            if i < self.instructions.__len__() - 1:
                json += ","
        json += "]"

        // Constants
        json += ",\"constants\":["
        for i in range(self.constants.__len__()):
            json += "\"" + self.constants[i] + "\""
            if i < self.constants.__len__() - 1:
                json += ","
        json += "]"

        // Symbols
        json += ",\"symbols\":{"
        for i in range(self.symbols.__len__()):
            json += "\"" + self.symbols[i] + "\":\""
            json += self.symbol_types[i] + "\""
            if i < self.symbols.__len__() - 1:
                json += ","
        json += "}"

        // Functions
        json += ",\"functions\":["
        for i in range(self.functions.__len__()):
            json += "\"" + self.functions[i] + "\""
            if i < self.functions.__len__() - 1:
                json += ","
        json += "]"

        // Globals
        json += ",\"globals\":["
        for i in range(self.globals.__len__()):
            json += "\"" + self.globals[i] + "\""
            if i < self.globals.__len__() - 1:
                json += ","
        json += "]"

        json += "}"
        return json

// ============================================================================
// IR Generator 정의
// ============================================================================

struct IRGenerator:
    var module: IRModule
    var label_counter: Int
    var var_stack: List[String]              // 현재 스코프의 변수들

    fn __init__(inout self):
        self.module = IRModule()
        self.label_counter = 0
        self.var_stack = List[String]()

    fn generate_label(inout self) -> String:
        // 유니크 레이블 생성
        var label = "label_" + str(self.label_counter)
        self.label_counter = self.label_counter + 1
        return label

    fn emit(inout self, op: String, args: List[String], result_type: String) -> Int:
        // 명령어 발행하고 인덱스 반환
        var instr = Instruction(op, args, result_type, 0)
        self.module.add_instruction(instr)
        return self.module.instructions.__len__() - 1

    fn emit_load_const(inout self, value: String, const_type: String) -> Int:
        // LOAD_CONST 발행
        var const_idx = self.module.add_constant(value)
        var args = List[String]()
        args.append(str(const_idx))
        return self.emit("LOAD_CONST", args, const_type)

    fn emit_load_var(inout self, name: String) -> Int:
        // LOAD_VAR 발행
        var args = List[String]()
        args.append(name)
        return self.emit("LOAD_VAR", args, "auto")

    fn emit_store_var(inout self, name: String, value_reg: Int) -> Int:
        // STORE_VAR 발행
        var args = List[String]()
        args.append(name)
        args.append(str(value_reg))
        return self.emit("STORE_VAR", args, "auto")

    fn emit_binary_op(inout self, op: String, left_reg: Int, right_reg: Int, result_type: String) -> Int:
        // BINARY_OP 발행
        var args = List[String]()
        args.append(op)
        args.append(str(left_reg))
        args.append(str(right_reg))
        return self.emit("BINARY_OP", args, result_type)

    fn emit_unary_op(inout self, op: String, operand_reg: Int, result_type: String) -> Int:
        // UNARY_OP 발행
        var args = List[String]()
        args.append(op)
        args.append(str(operand_reg))
        return self.emit("UNARY_OP", args, result_type)

    fn emit_jump(inout self, label: String) -> Int:
        // JUMP 발행
        var args = List[String]()
        args.append(label)
        return self.emit("JUMP", args, "auto")

    fn emit_jump_if_false(inout self, cond_reg: Int, label: String) -> Int:
        // JUMP_IF_FALSE 발행
        var args = List[String]()
        args.append(str(cond_reg))
        args.append(label)
        return self.emit("JUMP_IF_FALSE", args, "auto")

    fn emit_label(inout self, label: String) -> Int:
        // LABEL 발행 (점프 대상)
        var args = List[String]()
        args.append(label)
        return self.emit("LABEL", args, "auto")

    fn emit_call(inout self, func_name: String, arg_regs: List[Int], return_type: String) -> Int:
        // CALL 발행
        var args = List[String]()
        args.append(func_name)

        for i in range(arg_regs.__len__()):
            args.append(str(arg_regs[i]))

        return self.emit("CALL", args, return_type)

    fn emit_return(inout self, value_reg: Int) -> Int:
        // RETURN 발행
        var args = List[String]()
        args.append(str(value_reg))
        return self.emit("RETURN", args, "auto")

    fn emit_array_literal(inout self, elem_regs: List[Int]) -> Int:
        // ARRAY_LITERAL 발행
        var args = List[String]()

        for i in range(elem_regs.__len__()):
            args.append(str(elem_regs[i]))

        return self.emit("ARRAY_LITERAL", args, "array")

// ============================================================================
// Main - Day 1 Test
// ============================================================================

fn main():
    print("╔════════════════════════════════════════════════════════╗")
    print("║  Phase 16 Step 4: IR Generator (Day 1 - IR Structures) ║")
    print("╚════════════════════════════════════════════════════════╝")
    print()

    // Create IR module
    var gen = IRGenerator()

    // Test 1: Add constants
    print("Test 1: Adding constants...")
    var const_idx_10 = gen.module.add_constant("10")
    var const_idx_314 = gen.module.add_constant("3.14")
    var const_idx_hello = gen.module.add_constant("hello")
    print("  Constant 10 at index: " + str(const_idx_10))
    print("  Constant 3.14 at index: " + str(const_idx_314))
    print("  Constant hello at index: " + str(const_idx_hello))
    print()

    // Test 2: Add symbols
    print("Test 2: Adding symbols...")
    gen.module.add_symbol("x", "int")
    gen.module.add_symbol("y", "float")
    gen.module.add_symbol("result", "auto")
    print("  Added 3 symbols")
    print()

    // Test 3: Generate instructions
    print("Test 3: Generating instructions...")
    gen.emit_load_const("10", "int")
    gen.emit_store_var("x", 0)
    gen.emit_load_const("3.14", "float")
    gen.emit_store_var("y", 1)
    gen.emit_load_var("x")
    print("  Generated 5 instructions")
    print()

    // Test 4: Add functions
    print("Test 4: Adding functions...")
    gen.module.add_function("main")
    gen.module.add_function("add")
    print("  Added 2 functions")
    print()

    // Test 5: Generate output JSON
    print("Test 5: Generating JSON output...")
    var json_output = gen.module.to_json()
    print("  JSON length: " + str(json_output.__len__()) + " bytes")
    print()

    // Test 6: Display summary
    print("Test 6: Summary")
    print("  Instructions: " + str(gen.module.instructions.__len__()))
    print("  Constants: " + str(gen.module.constants.__len__()))
    print("  Symbols: " + str(gen.module.symbols.__len__()))
    print("  Functions: " + str(gen.module.functions.__len__()))
    print()

    print("✅ Day 1: IR Structure Design Complete")
    print("Ready for Day 2: Constant/Variable Processing")
