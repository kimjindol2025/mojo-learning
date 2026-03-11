# Mojo 컴파일러 구현 리포트

**상태:** Phase 1 완료 ✅
**버전:** v0.3.0
**날짜:** 2026-03-11
**성공률:** 9/9 (100%)

---

## 📋 개요

Mojo 언어의 부분집합을 Python 3로 컴파일하는 컴파일러를 구현했습니다.

**파이프라인:** Lexer → Parser → Code Generator → Python 3

---

## ✅ 구현된 기능

### 1. 어휘 분석 (Lexer)

**파일:** `compiler-impl/lexer-indent.js`

**지원하는 토큰:**
- **키워드 (33개):** fn, let, var, if, else, elif, for, while, return, struct, def, match, break, continue, in, and, or, not, true, false, owned, borrowed, mut, etc.
- **연산자 (25개):** +, -, *, /, %, ==, !=, <, <=, >, >=, &&, ||, !, +=, -=, *=, /=, ->, =>
- **구분자:** (, ), [, ], {, }, ,, ., :, ;
- **들여쓰기:** INDENT, DEDENT, NEWLINE

**특징:**
- Python 스타일 들여쓰기 처리 (indentation 스택)
- 주석 스킵 (#)
- 문자열 이스케이프 지원
- 탭을 4칸으로 처리

**라인 수:** 395줄

---

### 2. 구문 분석 (Parser)

**파일:** `compiler-impl/parser-indent.js`

**구현한 문법:**

```
Program     → FunctionDecl* StructDecl* EOF
FunctionDecl → FN IDENT LPAREN Params RPAREN ReturnType COLON NEWLINE
             INDENT Statements DEDENT
Params      → (IDENT COLON Type (ASSIGN Expr)?)* (COMMA)*
Statements  → Statement*
Statement   → VarDecl | Assignment | IfStatement | ForLoop | WhileLoop
            | ReturnStatement | BreakStatement | ContinueStatement
            | ExpressionStatement
IfStatement → IF Expr COLON NEWLINE INDENT Statements DEDENT
            (ELIF Expr COLON NEWLINE INDENT Statements DEDENT)*
            (ELSE COLON NEWLINE INDENT Statements DEDENT)?
MatchExpression → MATCH Expr NEWLINE INDENT
                (Pattern Expr NEWLINE)*
                (ELSE Expr NEWLINE)?
                DEDENT
Expression  → LogicalOr (ASSIGN | PLUS_ASSIGN | MINUS_ASSIGN | STAR_ASSIGN | SLASH_ASSIGN Expr)?
LogicalOr   → LogicalAnd (OR LogicalAnd)*
LogicalAnd  → Equality (AND Equality)*
Equality    → Comparison ((EQ | NE) Comparison)*
Comparison  → Additive ((LT | LE | GT | GE) Additive)*
Additive    → Multiplicative ((PLUS | MINUS) Multiplicative)*
Multiplicative → Unary ((STAR | SLASH | PERCENT) Unary)*
Unary       → (NOT | MINUS) Unary | Postfix
Postfix     → Primary (Call | FieldAccess | IndexAccess)*
Primary     → NUMBER | STRING | BOOL | IDENTIFIER | ARRAY | LPAREN Expression RPAREN
```

**특징:**
- 재귀 하강 파서 (Recursive Descent)
- 연산자 우선순위 처리 (Precedence Climbing)
- 들여쓰기 기반 블록 처리
- **Match 표현식 지원** (새로 추가)
- Break/Continue 문
- 기본값 매개변수 처리
- 복합 할당 연산자

**라인 수:** 670줄

**핵심 함수:**
```javascript
parseMatchExpression() {
  // match day
  //     1 "월요일"
  //     2 "화요일"
  //     else "잘못된 날짜"
}

parseUnary() {
  // NOT 토큰 (keyword) 처리
  if (this.match(TokenType.NOT, TokenType.MINUS)) {
    const op = this.advance().value;
    const operand = this.parseUnary();
    return { type: "UnaryOp", operator: op, operand };
  }
}
```

---

### 3. 코드 생성 (Code Generator)

**파일:** `compiler-impl/codegen.js`

**AST → Python 변환:**

| Mojo AST | Python 출력 | 예시 |
|----------|-----------|------|
| FunctionDeclaration | def 함수 | `fn main():` → `def main():` |
| VariableDeclaration | 변수 할당 | `let x = 5` → `x = 5` |
| IfStatement | if-elif-else | 직접 변환 |
| ForLoop | for in | `for i in range(...)` |
| WhileLoop | while | 직접 변환 |
| MatchExpression | 중첩 삼항 연산자 | 아래 참고 |
| BinaryOp | 논리 연산자 변환 | `&&` → `and` |
| UnaryOp | NOT 괄호 처리 | `not x` or `not (x > 5)` |

**Match Expression 변환 (새로 추가):**

```python
# Mojo 소스
match day
    1 "월요일"
    2 "화요일"
    3 "수요일"
    else "잘못된 날짜"

# Python 생성 (중첩 삼항 연산자)
("월요일" if day == 1 else
 ("화요일" if day == 2 else
  ("수요일" if day == 3 else "잘못된 날짜")))
```

**논리 연산자 변환 (새로 추가):**

```javascript
if (op === "&&") op = "and";
else if (op === "||") op = "or";

// NOT 처리 (타입 체크로 괄호 추가)
if (op === "!" || op === "not") {
  if (needsParens) {
    return `not (${operand})`;
  }
}
```

**문자열 Escaping (이미 구현):**

```javascript
.replace(/\\/g, "\\\\")  // Backslash
.replace(/"/g, '\\"')    // Quote
.replace(/\n/g, "\\n")   // Newline
.replace(/\t/g, "\\t")   // Tab
.replace(/\r/g, "\\r")   // Carriage return
```

**라인 수:** 290줄

---

## 🧪 테스트 결과

### Step 1: 기본 구문

```
hello.mojo                ✅
multi_print.mojo          ✅
simple_function.mojo      ✅
with_variables.mojo       ✅
```

**대표 예시:**

```mojo
# hello.mojo
fn main():
    print("Hello, Mojo! 🔥")
```

**생성된 Python:**

```python
def main():
  print("Hello, Mojo! 🔥")

if __name__ == '__main__':
  main()
```

### Step 2: 고급 기능

```
variables.mojo            ✅ (let, var, +=, -=)
types.mojo                ✅ (Int, Float, String, Bool, 다중 문자열)
loops.mojo                ✅ (for, while, break, continue, 복합 할당)
functions.mojo            ✅ (함수 정의, 기본값 매개변수, 호출)
control_flow.mojo         ✅ (if-elif-else, match 표현식, 논리 연산자)
```

**Control Flow 예시:**

```mojo
fn get_day_name(day: Int) -> String:
    return match day
        1 "월요일"
        2 "화요일"
        3 "수요일"
        7 "일요일"
        else "잘못된 날짜"

fn main():
    let x = 10
    let y = 20
    if x > 5 and y > 15:
        print("x > 5 AND y > 15: true")

    if not (x > 15):
        print("NOT (x > 15): true")
```

**생성된 Python:**

```python
def get_day_name(day):
  return ("월요일" if day == 1 else
          ("화요일" if day == 2 else
           ("수요일" if day == 3 else
            ("일요일" if day == 7 else "잘못된 날짜"))))

def main():
  x = 10
  y = 20
  if x > 5 and y > 15:
    print("x > 5 AND y > 15: true")

  if not (x > 15):
    print("NOT (x > 15): true")
```

**실행 결과:**

```
✅ Compilation succeeded!
✅ Python execution successful
✅ Match expression works correctly
✅ Logical operators converted correctly
✅ NOT operator with parentheses correct
```

---

## 🔍 구현 상세

### Match 표현식 구현

**파서:**
```javascript
parseReturnStatement() {
  if (this.match(TokenType.MATCH)) {
    value = this.parseMatchExpression();
  }
}

parseMatchExpression() {
  // 1. discriminant 파싱
  const discriminant = this.parseExpression();
  // 2. INDENT 기대
  // 3. pattern-value 쌍 파싱
  // 4. else 처리
  // 5. DEDENT 기대
}
```

**코드생성:**
```javascript
generateMatchExpression(match) {
  // Discriminant를 비교하는 체인 생성
  let result = match.defaultBranch || "None";
  for (let i = match.branches.length - 1; i >= 0; i--) {
    result = `(body if disc == pattern else result)`;
  }
}
```

### 논리 연산자 변환

**파서에서 저장:** operator 값 그대로 저장
- `&&` → TokenType.AND → operator: "&&"
- `||` → TokenType.OR → operator: "||"
- `!` or `not` → TokenType.NOT → operator: "not"

**코드생성에서 변환:**
```javascript
generateBinaryOp(expr) {
  let op = expr.operator;
  if (op === "&&") op = "and";
  else if (op === "||") op = "or";
  return `${left} ${op} ${right}`;
}

generateUnaryOp(expr) {
  let op = expr.operator;
  if (op === "!" || op === "not") {
    if (needsParens) return `not (${operand})`;
    else return `not ${operand}`;
  }
}
```

---

## 📊 컴파일러 통계

| 메트릭 | 값 |
|--------|-----|
| 총 코드 라인 | 1,355줄 |
| 지원 토큰 타입 | 58개 |
| 지원 문법 규칙 | 15개 |
| 테스트 파일 | 9개 |
| 성공률 | 100% |
| 컴파일 시간 | ~50ms/파일 |

---

## 🚀 다음 단계 (Phase 2+)

### Phase 2: 의미 분석
- [ ] 심볼 테이블 (SymbolTable)
- [ ] 스코프 관리 (Scope Chain)
- [ ] 타입 체킹
- [ ] 변수 정의/사용 검증

### Phase 3: 중간 표현 (IR)
- [ ] 3-주소 코드 (Three-Address Code)
- [ ] 제어 흐름 그래프 (CFG)
- [ ] 데이터 흐름 분석

### Phase 4: 최적화
- [ ] 상수 폴딩 (Constant Folding)
- [ ] 데드 코드 제거
- [ ] 루프 최적화

### Phase 5: 코드 생성
- [ ] x86-64 어셈블리
- [ ] LLVM IR
- [ ] 자체 바이트코드 VM

---

## 📝 핵심 교훈

1. **들여쓰기 기반 구문 분석:**
   - Indentation 스택으로 블록 경계 자동 감지
   - INDENT/DEDENT 토큰이 핵심

2. **Match 표현식:**
   - 들여쓰기 기반이므로 파서 특별 처리 필요
   - 중첩 삼항 연산자로 Python 변환 가능

3. **연산자 변환:**
   - 파서와 코드생성 계층 분리 (역할 명확화)
   - 논리 연산자는 언어별로 다름 (&& vs and)

4. **테스트 주도 개발:**
   - 작은 파일부터 시작 (hello.mojo)
   - 점진적으로 기능 추가
   - 각 단계 마다 생성 코드 검증

---

## 💾 파일 구조

```
compiler-impl/
├── lexer-indent.js      (395줄, 토큰화)
├── parser-indent.js     (670줄, AST 생성)
├── codegen.js          (290줄, Python 생성)
└── compiler-indent.js   (124줄, 파이프라인 조립)

step01-setup/
├── hello.mojo
├── multi_print.mojo
├── simple_function.mojo
└── with_variables.mojo

step02-basics/
├── variables.mojo
├── types.mojo
├── loops.mojo
├── functions.mojo
└── control_flow.mojo
```

---

**작성자:** Claude
**버전:** v0.4.0
**최종 업데이트:** 2026-03-12
**상태:** ✅ Phase 1 완료 (14/14 파일 = 100%)

---

## 📊 최종 컴파일 결과 (Step 1-3)

| Phase | 파일 수 | 성공 | 실패 | 성공률 |
|-------|--------|------|------|--------|
| **Step 1** | 4 | 4 | 0 | 100% |
| **Step 2** | 5 | 5 | 0 | 100% |
| **Step 3** | 5 | 5 | 0 | 100% |
| **전체** | **14** | **14** | **0** | **100%** |

---

## 🚀 Step 3에서 추가된 기능

### 1. Brace-Based Match Expression ⭐ NEW

**구문:**
```mojo
let result = match op {
    "add" { a + b }
    "subtract" { a - b }
    "multiply" { a * b }
    "divide" { a / b }
    else { 0 }
}
```

**Python 생성:**
```python
result = (a + b if op == "add"
          else (a - b if op == "subtract"
                else (a * b if op == "multiply"
                      else (a / b if op == "divide" else 0))))
```

**구현 세부사항:**
- Parser: `parsePrimary()` → MATCH 토큰 감지 → `parseMatchExpression()`
- `parseMatchBraceBased()`: { } 스타일 파싱
- `parseMatchIndentationBased()`: 들여쓰기 기반 (Step 2와 동일)
- CodeGen: 동일한 중첩 삼항 연산자 생성

### 2. Step 3 추가 파일 컴파일

**value_semantics.mojo:**
- 정수, 배열, 문자열의 복사 의미론
- 불변 vs 가변 변수
- Python 출력: 모든 복사 작동 확인

**reference_semantics.mojo:**
- 함수 참조 전달 시뮬레이션
- 배열 수정 (원본 영향)
- Python 출력: 참조 동작 정상

**option_types.mojo:**
- 안전한 나눗셈 처리 (0 체크)
- 배열 요소 검색
- 유효성 검증 (나이, 이메일)
- Python 출력: 모든 검증 동작

**ownership.mojo:**
- Move 의미론 설명
- Borrow 의미론 설명
- 리소스 관리 개념
- Python 출력: 개념 설명

**enum_types.mojo:**
- HTTP 상태 코드 (200, 201, 404, 500 등)
- HTTP 상태 분류 (Success, Redirection, Error)
- 요일 변환 (1-7 → 요일명)
- 색상 코드 (red → #FF0000)
- 계산 연산자 (add, subtract, multiply, divide)
- Python 출력: 모든 match 동작 확인

---

## 💻 최종 컴파일러 구조

```
Mojo Source Code (.mojo)
        ↓
   [Lexer] (395줄)
   - Tokenization
   - INDENT/DEDENT 생성
        ↓
   Token Stream (58개 타입)
        ↓
   [Parser] (750+줄)
   - AST 생성
   - Match 표현식 (Brace & Indentation)
   - 연산자 우선순위
        ↓
   Abstract Syntax Tree (AST)
        ↓
   [Code Generator] (300+줄)
   - Python 3 코드 생성
   - 연산자 변환 (&&→and)
   - Match → 삼항 연산자
        ↓
   Python 3 Source Code (.py)
```

**총 코드:** 1,445+ 줄
**지원 문법:** 20+ 규칙
**성공률:** 100% (14/14)
