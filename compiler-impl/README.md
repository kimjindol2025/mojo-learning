# Mojo 컴파일러 v0.1.0

## 현재 상태

✅ **작동하는 기능:**
- Lexer (토큰화)
- Parser (AST 생성) - 중괄호 기반 문법
- Code Generator (Python 코드 생성)
- 명령줄 인터페이스

✅ **지원하는 문법:**
- 함수 선언 (fn name() { ... })
- 변수 선언 (let x = 5)
- 기본 연산 (+, -, *, /, %)
- 조건문 (if condition { ... } else { ... })
- 반복문 (for i in iterable { ... }, while condition { ... })
- 재귀 함수
- 함수 호출
- 배열 리터럴
- 문자열 보간 (기본)

## 사용법

### 1. 컴파일만 수행
```bash
node compiler.js input.mojo
```

### 2. 컴파일 + Python 생성
```bash
node compiler.js input.mojo --output output.py
```

### 3. 컴파일 + 실행
```bash
node compiler.js input.mojo --run
```

## 파이프라인

```
Source Code (.mojo)
    ↓
Lexer (토큰화)
    ↓
Parser (AST 생성)
    ↓
Code Generator (Python 코드 생성)
    ↓
Python Code (.py)
    ↓
Python Runtime
```

## 테스트 결과

### test.mojo
```mojo
fn main() {
    print("Hello, Mojo!")
}
```
✅ 컴파일 완료 → Hello, Mojo! 출력

### test_loop.mojo
```mojo
fn main() {
    for i in range(5) {
        print(i)
    }
}
```
✅ 컴파일 완료 → 0 1 2 3 4 출력

### test_vars.mojo
```mojo
fn main() {
    let x = 5
    let y = 10
    let sum = x + y
    print(sum)
    if x < y {
        print("x is smaller")
    }
}
```
✅ 컴파일 완료 → 15, "x is smaller" 출력

### test_functions.mojo
```mojo
fn add(a, b) {
    let result = a + b
    return result
}

fn factorial(n) {
    if n <= 1 {
        return 1
    }
    return n * factorial(n - 1)
}

fn main() {
    print(add(3, 4))
    print(factorial(5))
}
```
✅ 컴파일 완료 → 7, 120 출력

## 다음 단계 (TODO)

### Phase 1: 들여쓰기 기반 파싱 (IN PROGRESS)
- [ ] Lexer에 INDENT/DEDENT 토큰 추가
- [ ] Parser를 들여쓰기 기반으로 수정
- [ ] Step 1-10 .mojo 파일들 지원

### Phase 2: 타입 시스템 (PLANNED)
- [ ] 기본 타입 검증 (Int, Float, String, Bool)
- [ ] 타입 추론
- [ ] 타입 에러 보고

### Phase 3: MLIR 생성 (PLANNED)
- [ ] lit 다이얼렉트 코드 생성
- [ ] 중간 언어 표현

### Phase 4: 고급 기능 (PLANNED)
- [ ] 구조체 지원
- [ ] 제네릭/파라메트릭 타입
- [ ] 클로저/람다
- [ ] 매크로

## 파일 구조

```
compiler-impl/
├── lexer.js           # 토큰화
├── parser.js          # AST 생성
├── codegen.js         # 코드 생성
├── compiler.js        # 메인 엔트리포인트
├── test.mojo          # 테스트 파일 1
├── test_loop.mojo     # 테스트 파일 2
├── test_vars.mojo     # 테스트 파일 3
├── test_functions.mojo # 테스트 파일 4
└── README.md          # 이 파일
```

## 작성일
- 2026-03-11
- Mojo 컴파일러 프로젝트 시작
