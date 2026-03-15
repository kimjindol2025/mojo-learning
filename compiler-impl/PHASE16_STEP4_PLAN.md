# Phase 16 Step 4: IR Generator (Mojo) — 계획

**예상 시작:** 2026-03-13
**예상 기간:** 7-10일
**총 코드량:** 600-800줄 (Mojo)

---

## 📋 개요

**목표:** Semantic Analyzer 출력(AST + 타입/스코프 정보)을 중간 표현(Intermediate Representation)으로 변환

**입력:**
```json
{
  "success": true,
  "errors": [],
  "warnings": [],
  "ast": { ... }  // parser.mojo 출력
}
```

**출력:**
```json
{
  "instructions": [
    { "op": "LOAD_CONST", "args": [0] },
    { "op": "LOAD_VAR", "args": ["x"] },
    { "op": "BINARY_OP", "args": ["+"] }
  ],
  "constants": [10],
  "symbols": { "x": { "type": "int", "line": 1 } }
}
```

**다음 단계:** Machine Code Generator / LLVM IR Generator

---

## 🏗️ 아키텍처

### IR 구조 (ir.mojo)

```mojo
struct Instruction:
    var op: String           // LOAD_CONST, LOAD_VAR, STORE_VAR, BINARY_OP, ...
    var args: List[String]   // 각 명령어별 인자
    var type: String         // 연산 결과 타입 ("int", "float", "string", etc.)
    var line: Int            // 소스 코드 라인 번호

struct IRModule:
    var instructions: List[Instruction]
    var constants: List[String]          // 상수풀 (10, 3.14, "hello")
    var symbols: Dict[String, String]    // 심볼 타입 정보
    var functions: List[String]          // 함수 이름 목록
    var globals: List[String]            // 전역 변수 목록

struct IRGenerator:
    var module: IRModule
    var current_func: String
    var var_stack: List[Dict[String, String]]  // 각 스코프의 변수 매핑
```

### IR Opcode 정의 (60+ 명령어)

**Constant/Variable:**
```
LOAD_CONST      - 상수값 로드
LOAD_VAR        - 변수값 로드
STORE_VAR       - 변수에 값 저장
LOAD_GLOBAL     - 전역 변수 로드
STORE_GLOBAL    - 전역 변수 저장
LOAD_ARG        - 함수 인자 로드
```

**연산:**
```
BINARY_OP       - 이항 연산 (+, -, *, /, %, **, ==, !=, <, >, <=, >=, and, or)
UNARY_OP        - 단항 연산 (-, not)
CALL_FUNC       - 함수 호출
RETURN          - 반환
```

**제어흐름:**
```
JUMP            - 무조건 점프
JUMP_IF_FALSE   - 조건부 점프 (거짓일 때)
JUMP_IF_TRUE    - 조건부 점프 (참일 때)
LABEL           - 레이블 (점프 대상)
```

**배열/필드 접근:**
```
LOAD_SUBSCRIPT  - 배열 요소 접근
STORE_SUBSCRIPT - 배열 요소 저장
LOAD_ATTR       - 필드 접근
STORE_ATTR      - 필드 저장
```

**타입:**
```
TYPE_CAST       - 타입 변환
TYPE_CHECK      - 타입 확인
```

---

## 7일 구현 계획

### Day 1: IR 구조 설계 & 기본 인프라 (100줄)

**목표:** IR 모듈 구조와 기본 생성 인프라 구축

```mojo
struct IRModule: ...
struct Instruction: ...
struct IRGenerator:
    fn __init__(inout self)
    fn add_instruction(inout self, op: String, args: List[String], type: String)
    fn add_constant(inout self, value: String) -> Int  // 상수풀 인덱스 반환
    fn begin_scope(inout self)
    fn end_scope(inout self)
```

**테스트:** 기본 instruction 추가 및 상수풀 관리

### Day 2: 상수 & 변수 처리 (120줄)

**목표:** LOAD_CONST, LOAD_VAR, STORE_VAR 구현

```mojo
fn gen_literal(inout self, literal: String) -> String  // 상수풀 인덱스
fn gen_identifier(inout self, name: String) -> String  // 변수 접근
fn gen_assignment(inout self, name: String, value_ir: String)
fn lookup_var(self, name: String) -> String            // 타입 조회
```

**케이스:**
- 정수 리터럴 (10, -5)
- 실수 리터럴 (3.14, 2.0)
- 문자열 리터럴 ("hello")
- 불 리터럴 (true, false)
- 변수 참조 (x, result)
- 전역 변수 (global_x)

### Day 3: 연산 코드 생성 (140줄)

**목표:** BinaryOp, UnaryOp, Call 코드 생성

```mojo
fn gen_binary_op(inout self, left_ir: String, op: String, right_ir: String) -> String
fn gen_unary_op(inout self, op: String, operand_ir: String) -> String
fn gen_call(inout self, func_name: String, args_ir: List[String]) -> String
```

**케이스:**
- 산술 연산 (+, -, *, /, %, **)
- 비교 연산 (==, !=, <, >, <=, >=)
- 논리 연산 (and, or, not)
- 함수 호출 (print, len, custom functions)
- 중첩 연산 ((2 + 3) * 4)

### Day 4: 제어흐름 (150줄)

**목표:** if/while/for 루프 코드 생성

```mojo
fn gen_if_statement(inout self, condition_ir: String, then_ir: List[String], else_ir: List[String])
fn gen_while_loop(inout self, condition_ir: String, body_ir: List[String])
fn gen_for_loop(inout self, var_name: String, iter_ir: String, body_ir: List[String])
fn gen_label(inout self) -> Int          // 유니크 레이블 생성
fn gen_jump(inout self, label: Int)
fn gen_jump_if(inout self, cond_ir: String, label: Int, is_true: Bool)
```

**케이스:**
- 단순 if
- if-elif-else 체인
- while 루프
- for 루프
- break/continue (루프 내)
- 중첩 제어 구조

### Day 5: 함수 선언 & 호출 (130줄)

**목표:** 함수 프롤로그/에필로그, 호출 규약

```mojo
fn gen_function_decl(inout self, name: String, params: List[String], body_ir: List[String], return_type: String)
fn gen_return(inout self, value_ir: String)
fn gen_param_setup(inout self, params: List[String])
fn gen_param_cleanup(inout self)
```

**케이스:**
- 매개변수 정의 및 로드
- 로컬 변수 초기화
- 반환값 처리
- 함수 오버로딩 (서로 다른 시그니처)
- 재귀 호출

### Day 6: 배열 & 필드 접근 (100줄)

**목표:** LOAD_SUBSCRIPT, LOAD_ATTR 코드 생성

```mojo
fn gen_array_literal(inout self, elements_ir: List[String]) -> String
fn gen_index_access(inout self, object_ir: String, index_ir: String) -> String
fn gen_field_access(inout self, object_ir: String, field_name: String) -> String
fn gen_array_store(inout self, object_ir: String, index_ir: String, value_ir: String)
```

**케이스:**
- 배열 리터럴 ([1, 2, 3])
- 인덱싱 (arr[0], arr[i])
- 필드 접근 (obj.field)
- 중첩 접근 (arr[0][1], obj.field.nested)

### Day 7: 최적화 & 검증 (80줄)

**목표:** 기본 최적화, IR 검증, 출력 생성

```mojo
fn optimize_ir(inout self)              // 상수 폴딩, 불필요한 로드 제거
fn verify_ir(self) -> List[String]      // 무효한 opcode, 타입 검사
fn emit_json(self) -> String            // IR을 JSON으로 직렬화
```

**최적화:**
- 상수 폴딩 (2 + 3 → 5)
- 불필요한 LOAD/STORE 제거
- 도달 불가능 코드 제거
- 루프 불변식 이동

---

## 🔗 Step 3과의 통합

### Semantic Analyzer 출력 활용

```mojo
// Step 3에서:
struct SemanticAnalyzer:
    var scopes: List[ScopeEntry]       // 스코프 정보
    var errors: List[String]           // 에러 목록
    var func_sig_names: List[String]   // 함수 시그니처

// Step 4에서:
fn gen_from_semantic_output(semantic_json: String) -> IRModule:
    // 파싱한 semantic 정보로 IR 생성
    // 타입 정보 활용
    // 스코프 정보 활용
```

### 타입 정보 활용

```mojo
// 변수 선언 시 타입 정보
let x: Int = 10
→ Symbol("x", type="int")
→ LOAD_CONST, STORE_VAR with type="int"

// 함수 호출 시 반환 타입
fn add(a: Int, b: Int) -> Int: ...
→ Call with return_type="int"
```

---

## 📊 코드 통계

```
Files:
├── ir.mojo               150 lines (IR 구조)
├── ir-generator.mojo     400 lines (코드 생성)
├── ir-optimizer.mojo     80 lines (최적화)
├── ir-validator.mojo     70 lines (검증)
└── verify-step4.js       200 lines (검증 스크립트)

Total: ~900 lines (Mojo + JS)

Methods:
├── IR 구조: 4 structs
├── Generator: 25 methods
├── Optimizer: 5 methods
├── Validator: 4 methods
```

---

## ✅ 검증 계획

### 단위 테스트
- 각 opcode 코드 생성 검증
- 상수풀 관리 검증
- 심볼 테이블 접근 검증

### 통합 테스트
- 단순 프로그램 → IR 생성 → 실행
- 제어흐름 검증
- 함수 호출 검증

### 성능 테스트
- 10,000 라인 파일 처리 시간
- IR 코드 크기
- 메모리 사용량

---

## 🎯 Success Criteria

✅ 모든 AST 노드 타입을 IR로 변환 가능
✅ 타입 정보 손실 없음
✅ 제어흐름 정보 정확함
✅ 함수 호출 규약 명확함
✅ IR 출력 JSON 형식 일관성
✅ verify-step4.js 모든 테스트 통과
✅ 기본 최적화 작동

---

## 📅 타임라인

| Day | Deliverable | Lines | Status |
|-----|-------------|-------|--------|
| 1 | IR 구조 설계 | 100 | ⬜ |
| 2 | 상수/변수 처리 | 120 | ⬜ |
| 3 | 연산 코드 생성 | 140 | ⬜ |
| 4 | 제어흐름 | 150 | ⬜ |
| 5 | 함수 선언 | 130 | ⬜ |
| 6 | 배열/필드 | 100 | ⬜ |
| 7 | 최적화 & 검증 | 80 | ⬜ |

**Total:** 820 줄

---

## 🚀 시작 전 필수사항

1. ✅ Step 3 semantic-analyzer.mojo 완성
2. ✅ Step 3 검증 완료
3. ⬜ Mojo 환경 확인 (컴파일 가능 상태)
4. ⬜ reference-ir.json 생성 (JS 참조 구현)

---

**Ready for Step 4 implementation?** YES - 2026-03-13 시작 가능
