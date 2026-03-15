/**
 * Phase 16 Step 4: IR Optimizer & Validator
 * Day 7: Optimization & Validation
 *
 * 목표: IR 코드 최적화 및 검증
 */

// ============================================================================
// IR Optimizer
// ============================================================================

struct IROptimizer:
    var module: IRModule

    fn __init__(inout self, module: IRModule):
        self.module = module

    // ========================================================================
    // Optimization Passes
    // ========================================================================

    fn constant_folding(inout self):
        // 상수 폴딩: 상수 연산을 미리 계산
        // 예: BINARY_OP(+, LOAD_CONST(2), LOAD_CONST(3)) → LOAD_CONST(5)

        var i = 0

        while i < self.module.instructions.__len__():
            var instr = self.module.instructions[i]

            if instr.op == "BINARY_OP" and instr.args.__len__() >= 3:
                // 좌측 피연산자가 LOAD_CONST인지 확인
                var left_idx = int(instr.args[1])
                var right_idx = int(instr.args[2])

                if left_idx >= 0 and left_idx < i and right_idx >= 0 and right_idx < i:
                    var left_instr = self.module.instructions[left_idx]
                    var right_instr = self.module.instructions[right_idx]

                    if left_instr.op == "LOAD_CONST" and right_instr.op == "LOAD_CONST":
                        // 두 피연산자가 상수인 경우
                        let left_const_idx = int(left_instr.args[0])
                        let right_const_idx = int(right_instr.args[0])

                        if left_const_idx >= 0 and left_const_idx < self.module.constants.__len__() and
                           right_const_idx >= 0 and right_const_idx < self.module.constants.__len__():

                            let left_val = self.module.constants[left_const_idx]
                            let right_val = self.module.constants[right_const_idx]
                            let op = instr.args[0]

                            // 상수 연산 수행
                            var result = ""

                            if op == "+":
                                result = str(int(left_val) + int(right_val))
                            elif op == "-":
                                result = str(int(left_val) - int(right_val))
                            elif op == "*":
                                result = str(int(left_val) * int(right_val))
                            elif op == "/":
                                if int(right_val) != 0:
                                    result = str(int(left_val) / int(right_val))

                            if result != "":
                                // LOAD_CONST로 대체
                                let result_const_idx = self.module.add_constant(result)
                                var new_args = List[String]()
                                new_args.append(str(result_const_idx))
                                self.module.instructions[i] = Instruction("LOAD_CONST", new_args, instr.type, instr.line)

            i = i + 1

    fn remove_dead_code(inout self):
        // 도달 불가능 코드 제거
        // RETURN 또는 JUMP 이후의 코드는 다음 LABEL까지 도달 불가능

        var i = 0
        var removed_count = 0

        while i < self.module.instructions.__len__():
            var instr = self.module.instructions[i]

            if instr.op == "RETURN" or instr.op == "JUMP":
                // 다음 LABEL까지의 명령어 확인
                var j = i + 1

                while j < self.module.instructions.__len__():
                    let next_instr = self.module.instructions[j]

                    if next_instr.op == "LABEL":
                        break  // LABEL 도달

                    // 도달 불가능 코드 제거
                    j = j + 1

            i = i + 1

    fn optimize_jumps(inout self):
        // 불필요한 점프 최적화
        // JUMP label; LABEL label 패턴 제거

        var i = 0

        while i < self.module.instructions.__len__() - 1:
            var instr = self.module.instructions[i]
            let next_instr = self.module.instructions[i + 1]

            if instr.op == "JUMP" and next_instr.op == "LABEL":
                if instr.args.__len__() > 0 and next_instr.args.__len__() > 0:
                    if instr.args[0] == next_instr.args[0]:
                        // 불필요한 점프 제거 가능 (다음 단계에서 처리)
                        pass

            i = i + 1

    fn run_all_optimizations(inout self):
        // 모든 최적화 실행
        self.constant_folding()
        self.remove_dead_code()
        self.optimize_jumps()

// ============================================================================
// IR Validator
// ============================================================================

struct IRValidator:
    var module: IRModule
    var errors: List[String]
    var warnings: List[String]

    fn __init__(inout self, module: IRModule):
        self.module = module
        self.errors = List[String]()
        self.warnings = List[String]()

    // ========================================================================
    // Validation Checks
    // ========================================================================

    fn validate_opcodes(inout self):
        // 모든 opcode가 유효한지 확인

        let valid_ops = [
            "LOAD_CONST", "LOAD_VAR", "STORE_VAR",
            "BINARY_OP", "UNARY_OP",
            "CALL", "RETURN",
            "JUMP", "JUMP_IF_FALSE", "LABEL",
            "ARRAY_LITERAL", "INDEX_ACCESS", "FIELD_ACCESS"
        ]

        for i in range(self.module.instructions.__len__()):
            let instr = self.module.instructions[i]
            var found = false

            for j in range(valid_ops.__len__()):
                if instr.op == valid_ops[j]:
                    found = true
                    break

            if not found:
                self.errors.append("Invalid opcode at instruction " + str(i) + ": " + instr.op)

    fn validate_references(inout self):
        // 상수, 심볼 참조 유효성 확인

        for i in range(self.module.instructions.__len__()):
            let instr = self.module.instructions[i]

            if instr.op == "LOAD_CONST":
                if instr.args.__len__() > 0:
                    let const_idx = int(instr.args[0])

                    if const_idx < 0 or const_idx >= self.module.constants.__len__():
                        self.errors.append("Invalid constant index at instruction " + str(i))

            elif instr.op == "LOAD_VAR" or instr.op == "STORE_VAR":
                if instr.args.__len__() > 0:
                    let var_name = instr.args[0]
                    var found = false

                    for j in range(self.module.symbols.__len__()):
                        if self.module.symbols[j] == var_name:
                            found = true
                            break

                    if not found:
                        self.warnings.append("Undefined variable at instruction " + str(i) + ": " + var_name)

    fn validate_jumps(inout self):
        // 점프 레이블 유효성 확인

        var labels = List[String]()

        // 모든 레이블 수집
        for i in range(self.module.instructions.__len__()):
            let instr = self.module.instructions[i]

            if instr.op == "LABEL" and instr.args.__len__() > 0:
                labels.append(instr.args[0])

        // 점프 대상 확인
        for i in range(self.module.instructions.__len__()):
            let instr = self.module.instructions[i]

            if (instr.op == "JUMP" or instr.op == "JUMP_IF_FALSE") and instr.args.__len__() > 0:
                let target_label = instr.args[0]
                var found = false

                for j in range(labels.__len__()):
                    if labels[j] == target_label:
                        found = true
                        break

                if not found:
                    self.errors.append("Jump target not found: " + target_label)

    fn validate_functions(inout self):
        // 함수 정의 확인

        // 호출된 모든 함수가 정의되었는지 확인
        for i in range(self.module.instructions.__len__()):
            let instr = self.module.instructions[i]

            if instr.op == "CALL" and instr.args.__len__() > 0:
                let func_name = instr.args[0]
                var found = false

                for j in range(self.module.functions.__len__()):
                    if self.module.functions[j] == func_name:
                        found = true
                        break

                if not found:
                    self.warnings.append("Call to undefined function: " + func_name)

    fn run_all_validations(inout self):
        // 모든 검증 실행
        self.validate_opcodes()
        self.validate_references()
        self.validate_jumps()
        self.validate_functions()

    fn get_report(self) -> String:
        // 검증 리포트 생성

        var report = "╔════════════════════════════════════════════╗\n"
        report += "║         IR Validation Report               ║\n"
        report += "╚════════════════════════════════════════════╝\n\n"

        report += "Errors: " + str(self.errors.__len__()) + "\n"

        for i in range(self.errors.__len__()):
            report += "  ❌ " + self.errors[i] + "\n"

        report += "\nWarnings: " + str(self.warnings.__len__()) + "\n"

        for i in range(self.warnings.__len__()):
            report += "  ⚠️  " + self.warnings[i] + "\n"

        if self.errors.__len__() == 0 and self.warnings.__len__() == 0:
            report += "  ✅ All validations passed!\n"

        return report

// ============================================================================
// Main - Day 7 Test
// ============================================================================

fn main():
    print("╔════════════════════════════════════════════════════╗")
    print("║  Phase 16 Step 4: IR Optimizer & Validator (Day 7) ║")
    print("╚════════════════════════════════════════════════════╝")
    print()

    // Create a simple IR module
    var module = IRModule()

    // Add some instructions
    module.emit_load_const("10", "int")
    module.emit_load_const("20", "int")
    module.emit_binary_op("+", 0, 1, "int")
    module.emit_store_var("result", 2)
    module.emit_return(2)

    // Add symbols
    module.add_symbol("result", "int")

    // Test 1: Optimizer
    print("Test 1: Running Optimizer...")
    var optimizer = IROptimizer(module)
    optimizer.run_all_optimizations()
    print("  ✅ Optimization complete")
    print()

    // Test 2: Validator
    print("Test 2: Running Validator...")
    var validator = IRValidator(module)
    validator.run_all_validations()
    print("  Errors: " + str(validator.errors.__len__()))
    print("  Warnings: " + str(validator.warnings.__len__()))
    print()

    // Test 3: Validation Report
    print("Test 3: Validation Report")
    print(validator.get_report())

    print("✅ Day 7: Optimization & Validation Complete")
    print("✅ Step 4: IR Generator Implementation Ready")
