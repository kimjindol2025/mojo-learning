# Phase 16 Step 5: Machine Code Generator (Mojo) — 계획

**예상 시작:** 2026-03-22
**예상 기간:** 7-10일
**총 코드량:** 800-1000줄 (Mojo)

---

## 📋 개요

**목표:** IR Generator 출력(IR instructions)을 x86-64 어셈블리/바이너리로 변환

**입력:**
```json
{
  "instructions": [
    { "op": "LOAD_CONST", "args": ["0"], "type": "int" },
    { "op": "BINARY_OP", "args": ["+", "0", "1"], "type": "int" }
  ],
  "constants": [10, 20],
  "symbols": {"x": "int"},
  "functions": ["main"]
}
```

**출력:**
```asm
main:
    push rbp
    mov rbp, rsp
    mov eax, 10        ; LOAD_CONST 10
    mov ecx, 20        ; LOAD_CONST 20
    add eax, ecx       ; BINARY_OP +
    mov [rbp-8], eax   ; STORE_VAR x
    mov rsp, rbp
    pop rbp
    ret
```

**다음 단계:** ELF 바이너리 생성 (Step 6)

---

## 🏗️ 아키텍처

### x86-64 Registers

**일반 레지스터:**
```
RAX, RBX, RCX, RDX, RSI, RDI, RBP, RSP
R8-R15 (64-bit extended)
```

**사용 관례:**
```
RAX: 반환값, 연산 결과
RBX: Callee-saved
RCX: 함수 인자 3 (첫번째는 RDI, 두번째는 RSI)
RDX: 함수 인자 4
RSI, RDI: 함수 인자 2, 1
RBP: Frame pointer (스택 주소)
RSP: Stack pointer
```

### Instruction Set (x86-64)

**데이터 이동:**
```asm
mov dest, src        ; 데이터 이동
lea dest, [src]      ; 주소 로드
```

**산술 연산:**
```asm
add dest, src        ; 덧셈
sub dest, src        ; 뺄셈
imul dest, src       ; 곱셈 (부호 있음)
idiv divisor         ; 나눗셈 (RAX ÷ divisor)
```

**논리 연산:**
```asm
and dest, src        ; AND
or dest, src         ; OR
xor dest, src        ; XOR
not dest             ; NOT
```

**비교 및 점프:**
```asm
cmp dest, src        ; 비교 (연산 결과 플래그에 저장)
jmp label            ; 무조건 점프
je label             ; 같으면 점프
jne label            ; 다르면 점프
jl label             ; 작으면 점프
jg label             ; 크면 점프
```

**함수 호출:**
```asm
call function        ; 함수 호출
ret                  ; 함수 반환
```

---

## 7일 구현 계획

### Day 1: x86-64 Generator 기본 구조 (120줄)

**목표:** 기본 코드 생성 인프라

```mojo
struct x86Register:
    var name: String        // "rax", "rbx", etc.
    var size: Int          // 64, 32, 16, 8
    var used: Bool

struct x86Instruction:
    var mnemonic: String   // "mov", "add", etc.
    var operands: List[String]
    var to_asm(self) -> String

struct MachineCodeGenerator:
    var ir_module: IRModule
    var registers: List[x86Register]
    var allocated_regs: Dict[Int, String]  // reg_id -> x86_reg
    var stack_offset: Int
    var instructions: List[x86Instruction]
```

**메서드:**
```mojo
fn allocate_register(inout self, for_reg: Int) -> String
fn free_register(inout self, x86_reg: String)
fn get_stack_address(inout self, var_name: String) -> String
fn emit_instruction(inout self, mnemonic: String, operands: List[String])
fn emit_label(inout self, label: String)
```

---

### Day 2: 상수 & 변수 처리 (140줄)

**목표:** LOAD_CONST, LOAD_VAR, STORE_VAR 생성

```mojo
fn gen_load_const(inout self, const_idx: Int, dest_reg: String)
    // mov dest_reg, CONST_VALUE

fn gen_load_var(inout self, var_name: String, dest_reg: String)
    // mov dest_reg, [rbp - offset]

fn gen_store_var(inout self, var_name: String, src_reg: String)
    // mov [rbp - offset], src_reg
```

**생성 코드:**
```asm
; LOAD_CONST 10
mov rax, 10

; LOAD_VAR x (if x at [rbp-8])
mov rax, [rbp-8]

; STORE_VAR x
mov [rbp-8], rax
```

---

### Day 3: 산술 연산 (130줄)

**목표:** BINARY_OP (+, -, *, /, %) 생성

```mojo
fn gen_binary_op(inout self, op: String, left_reg: String, right_reg: String, dest_reg: String)
    // mov dest_reg, left_reg
    // add/sub/imul/idiv dest_reg, right_reg

fn gen_unary_op(inout self, op: String, operand_reg: String, dest_reg: String)
    // neg/not operand_reg
```

**생성 코드:**
```asm
; a + b (left=rax, right=rcx)
mov rax, [rbp-8]     ; load a
mov rcx, [rbp-16]    ; load b
add rax, rcx         ; a + b
mov [rbp-24], rax    ; store result

; a * b
mov rax, [rbp-8]
mov rcx, [rbp-16]
imul rax, rcx

; a / b
mov rax, [rbp-8]
mov rcx, [rbp-16]
cqo                  ; sign extend RAX to RDX:RAX
idiv rcx             ; RAX ÷ RCX
```

---

### Day 4: 함수 프롤로그/에필로그 (120줄)

**목표:** 함수 호출 규약, 스택 관리

```mojo
fn gen_function_prologue(inout self, func_name: String, num_locals: Int)
    // label
    // push rbp
    // mov rbp, rsp
    // sub rsp, (num_locals * 8)

fn gen_function_epilogue(inout self)
    // mov rsp, rbp
    // pop rbp
    // ret

fn gen_function_call(inout self, func_name: String, args: List[String]) -> String
    // arg1 -> rdi
    // arg2 -> rsi
    // arg3 -> rdx
    // arg4 -> rcx
    // call func_name
    // result -> rax
```

**생성 코드:**
```asm
add_two_numbers:
    push rbp
    mov rbp, rsp
    sub rsp, 16         ; 로컬 변수 2개 (16 바이트)

    mov rax, rdi        ; arg1 (a)
    mov rcx, rsi        ; arg2 (b)
    add rax, rcx

    mov rsp, rbp
    pop rbp
    ret
```

---

### Day 5: 제어흐름 & 점프 (110줄)

**목표:** if/while 루프 생성

```mojo
fn gen_jump(inout self, target_label: String)
    // jmp target_label

fn gen_jump_if_false(inout self, cond_reg: String, target_label: String)
    // cmp cond_reg, 0
    // je target_label

fn gen_label(inout self, label: String)
    // label:
```

**생성 코드:**
```asm
; if (a > b) { ... }
mov rax, [rbp-8]     ; load a
mov rcx, [rbp-16]    ; load b
cmp rax, rcx
jle else_label       ; if a <= b, skip then branch

; then branch
mov rax, 1
jmp end_if

else_label:
; else branch
mov rax, 0

end_if:
mov [rbp-24], rax
```

---

### Day 6: 배열 & 메모리 접근 (100줄)

**목표:** 배열 인덱싱, 메모리 할당

```mojo
fn gen_array_literal(inout self, elements: List[String], dest_reg: String)
    // 배열을 메모리에 할당하고 주소를 dest_reg에 저장

fn gen_index_access(inout self, array_reg: String, index_reg: String, dest_reg: String)
    // mov dest_reg, [array_reg + index_reg*8]

fn gen_field_access(inout self, object_reg: String, offset: Int, dest_reg: String)
    // mov dest_reg, [object_reg + offset]
```

---

### Day 7: 최적화 & 검증 (100줄)

**목표:** 레지스터 할당 최적화, 어셈블리 검증

```mojo
struct x86Optimizer:
    fn optimize_registers(inout self)
        // 불필요한 mov 제거
        // 인접한 명령어 병합

    fn optimize_jumps(inout self)
        // 불필요한 jmp 제거
        // 체인 최적화

struct x86Validator:
    fn validate_registers(self) -> List[String]
    fn validate_labels(self) -> List[String]
    fn validate_stack_usage(self) -> Int
```

---

## 📊 코드 통계

```
Files:
├── machine-codegen.mojo      400 lines (기본 구조 + Days 1-3)
├── x86-generator.mojo        300 lines (Days 4-6)
├── x86-optimizer.mojo        100 lines (Day 7)
└── verify-step5.js           200 lines (검증 스크립트)

Total: ~1000 lines
```

---

## 🔗 Step 4와의 통합

### 입력 (IR Generator output)
```
instructions: [
  {op: "LOAD_CONST", args: ["0"], type: "int"},
  {op: "BINARY_OP", args: ["+", "0", "1"], type: "int"},
  {op: "CALL", args: ["printf", "2"], type: "int"},
  {op: "RETURN", args: ["0"], type: "auto"}
]
constants: [10, 20]
symbols: {x: "int", result: "int"}
```

### 처리 과정
```
1. IR 레지스터 → x86-64 레지스터 매핑
2. 스택 오프셋 계산 (로컬 변수)
3. 각 IR instruction → x86-64 instruction 변환
4. 함수 프롤로그/에필로그 추가
5. 레지스터 할당 최적화
6. 어셈블리 코드 생성
```

### 출력 (x86-64 Assembly)
```asm
.globl main
main:
    push rbp
    mov rbp, rsp
    sub rsp, 32

    mov rax, 10        ; LOAD_CONST 0
    mov rcx, 20        ; LOAD_CONST 1
    add rax, rcx       ; BINARY_OP +
    mov rdi, rax
    call printf

    mov rax, 0         ; RETURN 0
    mov rsp, rbp
    pop rbp
    ret
```

---

## ✅ Success Criteria

✅ 모든 IR opcode를 x86-64로 변환 가능
✅ 함수 호출 규약 (System V AMD64 ABI) 준수
✅ 스택 프레임 올바르게 관리
✅ 레지스터 할당 최적화
✅ verify-step5.js 모든 테스트 통과
✅ 생성된 어셈블리가 유효함 (as/ld로 어셈블 가능)

---

## 📅 타임라인

| Day | Deliverable | Lines | Status |
|-----|-------------|-------|--------|
| 1 | x86 Generator 구조 | 120 | ⬜ |
| 2 | 상수/변수 처리 | 140 | ⬜ |
| 3 | 산술 연산 | 130 | ⬜ |
| 4 | 함수 프롤로그/에필로그 | 120 | ⬜ |
| 5 | 제어흐름 & 점프 | 110 | ⬜ |
| 6 | 배열 & 메모리 | 100 | ⬜ |
| 7 | 최적화 & 검증 | 100 | ⬜ |

**Total:** 820 줄

---

## 🚀 시작 전 필수사항

1. ✅ Step 4 IR Generator 완성
2. ✅ verify-step4.js 모든 테스트 통과
3. ⬜ x86-64 명령어 세트 학습
4. ⬜ System V AMD64 ABI 이해
5. ⬜ 어셈블러 (as) 설치 확인

---

**Ready for Step 5 implementation? YES - 2026-03-22 시작 가능** 🚀
