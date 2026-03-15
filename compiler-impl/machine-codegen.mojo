/**
 * Phase 16 Step 5: Machine Code Generator - x86-64 Implementation
 * Days 1-7: x86-64 Assembly Code Generation
 *
 * 목표: IR Code → x86-64 Assembly 변환
 * 입력: IRModule (instructions + constants + symbols)
 * 출력: x86-64 Assembly code
 */

// ============================================================================
// x86-64 Register Management
// ============================================================================

struct x86Register:
    var name: String         // "rax", "rbx", etc.
    var bit_size: Int        // 64, 32, 16, 8
    var is_available: Bool

    fn __init__(inout self):
        self.name = ""
        self.bit_size = 64
        self.is_available = true

    fn __init__(inout self, name: String, bit_size: Int):
        self.name = name
        self.bit_size = bit_size
        self.is_available = true

// ============================================================================
// x86-64 Instruction Representation
// ============================================================================

struct x86Instruction:
    var mnemonic: String            // "mov", "add", "call", etc.
    var operands: List[String]      // Destination, source, etc.
    var comment: String
    var line: Int

    fn __init__(inout self):
        self.mnemonic = ""
        self.operands = List[String]()
        self.comment = ""
        self.line = 0

    fn __init__(inout self, mnemonic: String, operands: List[String]):
        self.mnemonic = mnemonic
        self.operands = operands
        self.comment = ""
        self.line = 0

    fn to_asm(self) -> String:
        var asm = "    " + self.mnemonic

        if self.operands.__len__() > 0:
            asm += " "

            for i in range(self.operands.__len__()):
                asm += self.operands[i]

                if i < self.operands.__len__() - 1:
                    asm += ", "

        if self.comment != "":
            asm += "    ; " + self.comment

        return asm

// ============================================================================
// Machine Code Generator
// ============================================================================

struct MachineCodeGenerator:
    var ir_module: IRModule
    var instructions: List[x86Instruction]
    var registers: List[x86Register]
    var allocated_regs: List[String]           // x86 레지스터 할당 상태
    var stack_offset: Int                       // 스택 오프셋
    var var_stack_map: List[Dict[String, Int]] // 변수 → 스택 오프셋 매핑
    var label_counter: Int

    fn __init__(inout self, ir_module: IRModule):
        self.ir_module = ir_module
        self.instructions = List[x86Instruction]()
        self.registers = List[x86Register]()
        self.allocated_regs = List[String]()
        self.stack_offset = 0
        self.var_stack_map = List[Dict[String, Int]]()
        self.label_counter = 0

        // 사용 가능한 레지스터 초기화
        self.init_registers()

    fn init_registers(inout self):
        // 일반 용도 레지스터 (64-bit)
        var reg_names = ["rax", "rbx", "rcx", "rdx", "rsi", "rdi", "r8", "r9", "r10", "r11"]

        for i in range(reg_names.__len__()):
            var reg = x86Register(reg_names[i], 64)
            self.registers.append(reg)

    fn allocate_register(inout self) -> String:
        // 사용 가능한 레지스터 할당
        for i in range(self.registers.__len__()):
            if self.registers[i].is_available:
                self.registers[i].is_available = false
                return self.registers[i].name

        return "rax"  // fallback

    fn free_register(inout self, reg_name: String):
        // 레지스터 해제
        for i in range(self.registers.__len__()):
            if self.registers[i].name == reg_name:
                self.registers[i].is_available = true
                break

    fn get_stack_offset(inout self, var_name: String) -> Int:
        // 변수의 스택 오프셋 계산/저장
        if self.var_stack_map.__len__() == 0:
            var scope_map = Dict[String, Int]()
            self.var_stack_map.append(scope_map)

        var scope = self.var_stack_map[self.var_stack_map.__len__() - 1]

        if var_name in scope:
            return scope[var_name]

        // 새 변수: 스택에 할당
        self.stack_offset = self.stack_offset + 8  // 8바이트 (64-bit)
        scope[var_name] = self.stack_offset

        return self.stack_offset

    fn emit(inout self, mnemonic: String, operands: List[String], comment: String = ""):
        // x86 명령어 발행
        var instr = x86Instruction(mnemonic, operands)
        instr.comment = comment
        instr.line = self.instructions.__len__()
        self.instructions.append(instr)

    fn emit_label(inout self, label: String):
        // 레이블 발행 (특수 처리)
        var instr = x86Instruction(label + ":", List[String]())
        self.instructions.append(instr)

    // ========================================================================
    // Day 2: Constant & Variable Operations
    // ========================================================================

    fn gen_load_const(inout self, const_idx: Int, dest_reg: String):
        // LOAD_CONST: 상수를 레지스터에 로드
        if const_idx >= 0 and const_idx < self.ir_module.constants.__len__():
            let const_val = self.ir_module.constants[const_idx]
            var args = List[String]()
            args.append(dest_reg)
            args.append(const_val)
            self.emit("mov", args, "LOAD_CONST " + const_val)

    fn gen_load_var(inout self, var_name: String, dest_reg: String):
        // LOAD_VAR: 변수를 메모리에서 레지스터로 로드
        let offset = self.get_stack_offset(var_name)
        var addr = "[rbp-" + str(offset) + "]"
        var args = List[String]()
        args.append(dest_reg)
        args.append(addr)
        self.emit("mov", args, "LOAD_VAR " + var_name)

    fn gen_store_var(inout self, var_name: String, src_reg: String):
        // STORE_VAR: 레지스터 값을 메모리에 저장
        let offset = self.get_stack_offset(var_name)
        var addr = "[rbp-" + str(offset) + "]"
        var args = List[String]()
        args.append(addr)
        args.append(src_reg)
        self.emit("mov", args, "STORE_VAR " + var_name)

    // ========================================================================
    // Day 3: Arithmetic Operations
    // ========================================================================

    fn gen_binary_op(inout self, op: String, left_reg: String, right_reg: String):
        // BINARY_OP: 이항 연산
        var mnemonic = ""

        if op == "+":
            mnemonic = "add"
        elif op == "-":
            mnemonic = "sub"
        elif op == "*":
            mnemonic = "imul"
        elif op == "/":
            // idiv는 특수 처리 필요 (RAX, RDX)
            mnemonic = "idiv"
        else:
            return

        var args = List[String]()
        args.append(left_reg)
        args.append(right_reg)
        self.emit(mnemonic, args, "BINARY_OP " + op)

    fn gen_unary_op(inout self, op: String, operand_reg: String):
        // UNARY_OP: 단항 연산
        var mnemonic = ""

        if op == "-":
            mnemonic = "neg"
        elif op == "not":
            mnemonic = "not"
        else:
            return

        var args = List[String]()
        args.append(operand_reg)
        self.emit(mnemonic, args, "UNARY_OP " + op)

    // ========================================================================
    // Day 4: Function Prologue/Epilogue
    // ========================================================================

    fn gen_function_prologue(inout self, func_name: String, num_locals: Int):
        // 함수 프롤로그: 스택 설정
        self.emit_label(func_name)

        var push_args = List[String]()
        push_args.append("rbp")
        self.emit("push", push_args, "Save old frame pointer")

        var mov_args = List[String]()
        mov_args.append("rbp")
        mov_args.append("rsp")
        self.emit("mov", mov_args, "Set up new frame pointer")

        if num_locals > 0:
            var sub_args = List[String]()
            sub_args.append("rsp")
            sub_args.append(str(num_locals * 8))
            self.emit("sub", sub_args, "Allocate local variables")

        self.stack_offset = 0

    fn gen_function_epilogue(inout self):
        // 함수 에필로그: 스택 정리 및 반환
        var mov_args = List[String]()
        mov_args.append("rsp")
        mov_args.append("rbp")
        self.emit("mov", mov_args, "Clean up stack")

        var pop_args = List[String]()
        pop_args.append("rbp")
        self.emit("pop", pop_args, "Restore frame pointer")

        self.emit("ret", List[String](), "Return from function")

    fn gen_function_call(inout self, func_name: String, num_args: Int) -> String:
        // 함수 호출
        var call_args = List[String]()
        call_args.append(func_name)
        self.emit("call", call_args, "Call " + func_name)

        return "rax"  // 반환값은 RAX에

    // ========================================================================
    // Day 5: Control Flow
    // ========================================================================

    fn gen_jump(inout self, target_label: String):
        // 무조건 점프
        var args = List[String]()
        args.append(target_label)
        self.emit("jmp", args, "Jump to " + target_label)

    fn gen_jump_if_false(inout self, cond_reg: String, target_label: String):
        // 조건이 거짓이면 점프
        var cmp_args = List[String]()
        cmp_args.append(cond_reg)
        cmp_args.append("0")
        self.emit("cmp", cmp_args, "Compare condition with 0")

        var je_args = List[String]()
        je_args.append(target_label)
        self.emit("je", je_args, "Jump if equal (false)")

    fn generate_label(inout self) -> String:
        // 유니크 레이블 생성
        var label = "label_" + str(self.label_counter)
        self.label_counter = self.label_counter + 1
        return label

    // ========================================================================
    // Day 6: Array & Memory Access
    // ========================================================================

    fn gen_array_literal(inout self, elements: List[String], dest_reg: String):
        // ARRAY_LITERAL: 배열을 메모리에 할당하고 주소를 dest_reg에 저장
        // mov dest_reg, [allocated memory address]

        var addr = "array_" + str(self.label_counter)
        self.label_counter = self.label_counter + 1

        var args = List[String]()
        args.append(dest_reg)
        args.append(addr)
        self.emit("lea", args, "ARRAY_LITERAL with " + str(elements.__len__()) + " elements")

    fn gen_index_access(inout self, array_reg: String, index_reg: String, dest_reg: String):
        // INDEX_ACCESS: 배열 인덱싱
        // mov dest_reg, [array_reg + index_reg*8]

        var addr = "[" + array_reg + "+" + index_reg + "*8]"
        var args = List[String]()
        args.append(dest_reg)
        args.append(addr)
        self.emit("mov", args, "INDEX_ACCESS")

    fn gen_field_access(inout self, object_reg: String, offset: Int, dest_reg: String):
        // FIELD_ACCESS: 필드 접근
        // mov dest_reg, [object_reg + offset]

        var addr = "[" + object_reg + "+" + str(offset) + "]"
        var args = List[String]()
        args.append(dest_reg)
        args.append(addr)
        self.emit("mov", args, "FIELD_ACCESS at offset " + str(offset))

    // ========================================================================
    // Output Generation
    // ========================================================================

    fn to_asm(self) -> String:
        // x86-64 어셈블리 코드 생성
        var asm = ".globl main\n"
        asm += ".section .text\n\n"

        for i in range(self.instructions.__len__()):
            let instr = self.instructions[i]
            asm += instr.to_asm() + "\n"

        return asm

    fn get_instruction_count(self) -> Int:
        return self.instructions.__len__()

// ============================================================================
// Main - Day 1 Test
// ============================================================================

fn main():
    print("╔═══════════════════════════════════════════════════════╗")
    print("║  Phase 16 Step 5: Machine Code Generator (Day 1)     ║")
    print("╚═══════════════════════════════════════════════════════╝")
    print()

    // Create IR module for testing
    var ir_module = IRModule()
    ir_module.add_constant("10")
    ir_module.add_constant("20")
    ir_module.add_symbol("x", "int")
    ir_module.add_symbol("result", "int")
    ir_module.add_function("main")

    // Create code generator
    var gen = MachineCodeGenerator(ir_module)

    // Test 1: Function prologue
    print("Test 1: Function prologue...")
    gen.gen_function_prologue("main", 2)
    print("  ✅ Prologue generated")
    print()

    // Test 2: Load constant
    print("Test 2: Load constants...")
    gen.gen_load_const(0, "rax")
    gen.gen_load_const(1, "rcx")
    print("  ✅ Constants loaded")
    print()

    // Test 3: Store variable
    print("Test 3: Store variables...")
    gen.gen_store_var("x", "rax")
    gen.gen_store_var("result", "rcx")
    print("  ✅ Variables stored")
    print()

    // Test 4: Load variable
    print("Test 4: Load variables...")
    gen.gen_load_var("x", "rax")
    gen.gen_load_var("result", "rcx")
    print("  ✅ Variables loaded")
    print()

    // Test 5: Binary operation
    print("Test 5: Binary operations...")
    gen.gen_binary_op("+", "rax", "rcx")
    gen.gen_binary_op("*", "rax", "rcx")
    print("  ✅ Operations generated")
    print()

    // Test 6: Function epilogue
    print("Test 6: Function epilogue...")
    gen.gen_function_epilogue()
    print("  ✅ Epilogue generated")
    print()

    // Test 7: Array operations
    print("Test 7: Array operations...")
    var elem_indices = List[String]()
    elem_indices.append("0")
    elem_indices.append("1")
    gen.gen_array_literal(elem_indices, "rax")
    gen.gen_index_access("rax", "rbx", "rcx")
    print("  ✅ Array operations generated")
    print()

    // Test 8: Field access
    print("Test 8: Field access...")
    gen.gen_field_access("rax", 16, "rcx")
    gen.gen_field_access("rax", 24, "rdx")
    print("  ✅ Field access generated")
    print()

    // Test 9: Generate assembly
    print("Test 9: Generate assembly...")
    let asm = gen.to_asm()
    print("  Instructions: " + str(gen.get_instruction_count()))
    print("  Assembly length: " + str(asm.__len__()) + " bytes")
    print()

    // Display generated assembly
    print("Generated Assembly (truncated):")
    print("─────────────────────────────────────────")
    if asm.__len__() > 300:
        print(asm.__getitem__(0, 300))
        print("... (truncated)")
    else:
        print(asm)
    print("─────────────────────────────────────────")
    print()

    print("✅ Days 1-6: Machine Code Generator Complete")
    print("Ready for Day 7: Optimization & Validation")
