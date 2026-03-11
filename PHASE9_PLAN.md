# Phase 9+: Advanced Features Planning

## Overview
Mojo compiler v0.9.0에서 v1.0.0으로 진화. 4가지 고급 기능 구현.

**순서:**
1. Phase 9: Default Parameters (쉬움, 실용적)
2. Phase 10: Variadic Arguments (중간)
3. Phase 11: Type Constraints (어려움)
4. Phase 12: LLVM Backend (매우 어려움)

---

## Phase 9: Default Parameters

### 목표
함수 선언 시 기본값 설정: `fn func(x: Int = 10, y: String = "hello")`

### 현재 상태
```javascript
// parser: 기본값 파싱 코드 이미 있음 (파라미터 파싱 중 ASSIGN 처리)
// 하지만 기본값을 AST에 저장 안 함
```

### 구현 계획

#### 1. Parser 수정 (parser-indent.js)
```javascript
// parseFunction에서 parameter 파싱 수정
// {name, type, defaultValue?} 구조로 변경

fn parseFunction() {
  // ...
  while (!this.match(TokenType.RPAREN)) {
    const paramName = this.peek().value;
    this.advance();

    let paramType = "auto";
    if (this.match(TokenType.COLON)) {
      this.advance();
      paramType = this.peek().value;
      this.advance();
    }

    let defaultValue = null;
    if (this.match(TokenType.ASSIGN)) {
      this.advance();
      // 기본값 파싱: 상수나 간단한 표현식만
      defaultValue = this.parsePrimary();  // 또는 parseAdditive()
    }

    parameters.push({name, type: paramType, defaultValue});
  }
}
```

#### 2. CodeGen 수정 (codegen.js)
```javascript
generateFunction(fn) {
  const params = fn.parameters.map(p => {
    if (p.defaultValue) {
      const defaultCode = this.generateExpression(p.defaultValue);
      return `${p.name}=${defaultCode}`;
    }
    return p.name;
  }).join(", ");

  this.emit(`def ${fn.name}(${params}):`);
}
```

#### 3. Test Cases
```mojo
fn greet(name: String = "World"):
    print("Hello, " + name)

fn add(a: Int = 1, b: Int = 2) -> Int:
    return a + b

fn main():
    greet()           # "Hello, World"
    greet("Alice")    # "Hello, Alice"
    print(add())      # 3
    print(add(5))     # 7
    print(add(5, 10)) # 15
```

### 예상 난이도: ⭐⭐ (쉬움)
### 예상 시간: 30분~1시간

---

## Phase 10: Variadic Arguments

### 목표
가변 길이 인자: `fn sum(*args: Int) -> Int`

### 구현 계획

#### 1. Lexer (lexer-indent.js)
- STAR 토큰 이미 있음 ✅

#### 2. Parser (parser-indent.js)
```javascript
// Parameter parsing 수정
if (this.match(TokenType.STAR)) {
  this.advance();
  const variadicName = this.peek().value;
  this.advance();

  let variadicType = "auto";
  if (this.match(TokenType.COLON)) {
    this.advance();
    variadicType = this.peek().value;
    this.advance();
  }

  parameters.push({
    name: variadicName,
    type: variadicType,
    isVariadic: true
  });
}
```

#### 3. CodeGen (codegen.js)
```javascript
// Python *args로 변환
const params = fn.parameters.map(p => {
  if (p.isVariadic) {
    return `*${p.name}`;
  }
  // ... default value handling
  return p.name;
}).join(", ");
```

#### 4. Test Cases
```mojo
fn sum(*args: Int) -> Int:
    total = 0
    for x in args:
        total = total + x
    return total

fn main():
    print(sum())           # 0
    print(sum(1, 2, 3))    # 6
    print(sum(5, 10, 15))  # 30
```

### 예상 난이도: ⭐⭐⭐ (중간)
### 예상 시간: 1~2시간

---

## Phase 11: Type Constraints

### 목표
Generic type에 제약 조건: `fn process<T: Numeric>(x: T) -> T`

### Numeric Trait 정의
```mojo
trait Numeric:
    fn add(self, other: Self) -> Self
    fn multiply(self, scalar: Float) -> Self
```

### 구현 계획

#### 1. Parser (parser-indent.js)
```javascript
// parseFunction에서 generic 파싱 수정
if (this.match(TokenType.LT)) {
  this.advance();
  while (!this.match(TokenType.GT)) {
    const typeParam = this.peek().value;
    this.advance();

    let constraint = null;
    if (this.match(TokenType.COLON)) {
      this.advance();
      constraint = this.peek().value;  // "Numeric", "Hashable" 등
      this.advance();
    }

    generics.push({name: typeParam, constraint});

    if (this.match(TokenType.COMMA)) this.advance();
  }
}
```

#### 2. Semantic Analyzer (semantic-analyzer.js)
```javascript
// Type constraint 검증
// T가 Numeric이면 +, -, *, / 연산 가능한지 확인
```

#### 3. Codegen (codegen.js)
```javascript
// Python은 duck typing이므로 constraint 제약 적용 안 함
// 대신 주석으로 남김
```

#### 4. Test Cases
```mojo
trait Numeric:
    fn add(self, other: Self) -> Self

fn sum_elements<T: Numeric>(items: List) -> T:
    total = items[0]
    for i in range(1, len(items)):
        total = total.add(items[i])
    return total

fn main():
    nums = [1, 2, 3]
    print(sum_elements(nums))
```

### 예상 난이도: ⭐⭐⭐⭐ (어려움)
### 예상 시간: 3~5시간

---

## Phase 12: LLVM Backend

### 목표
Mojo → LLVM IR → Native Code

### 현재 파이프라인
```
.mojo → Lexer → Parser → SemanticAnalysis → CodeGen → Python
```

### 새로운 파이프라인
```
.mojo → Lexer → Parser → SemanticAnalysis → IR Generator → LLVM Backend → Native Binary
```

### 구현 단계

#### 1. Intermediate Representation (IR) 설계
```javascript
// LLVM IR 표현
{
  type: "Function",
  name: "add",
  params: [{name: "a", type: "i32"}, {name: "b", type: "i32"}],
  returnType: "i32",
  body: [
    {op: "add", lhs: "%a", rhs: "%b", result: "%result"},
    {op: "return", value: "%result"}
  ]
}
```

#### 2. IR Generator (ir-generator.js)
- AST → IR 변환
- 타입 기반 명령어 생성
- 메모리 관리 (할당, 해제)

#### 3. LLVM Code Generator (llvm-backend.js)
```javascript
// IR → LLVM Text Format 변환
// define i32 @add(i32 %a, i32 %b) {
//   %result = add i32 %a, %b
//   ret i32 %result
// }
```

#### 4. 컴파일 과정
```bash
.mojo → LLVM IR (텍스트)
↓
llc (LLVM Compiler)
↓
.s (어셈블리)
↓
as (Assembler)
↓
Native Binary (.out)
```

### 예상 난이도: ⭐⭐⭐⭐⭐ (매우 어려움)
### 예상 시간: 1주 이상

---

## 구현 순서 & 예상 시간

| Phase | 기능 | 난이도 | 시간 | 누적 |
|-------|------|--------|------|-----|
| 9 | Default Parameters | ⭐⭐ | 1h | 1h |
| 10 | Variadic Arguments | ⭐⭐⭐ | 2h | 3h |
| 11 | Type Constraints | ⭐⭐⭐⭐ | 4h | 7h |
| 12 | LLVM Backend | ⭐⭐⭐⭐⭐ | 1-2d | 1-2d |

---

## 시작: Phase 9 Default Parameters

### 첫 번째 작업
1. ✅ Parser 수정: default value AST 저장
2. ✅ CodeGen 수정: Python default parameter 생성
3. ✅ Test 작성 및 검증
4. ✅ Phase 9 Report 작성

**예상 완료:** 1시간 후

준비됐나요? 🚀
