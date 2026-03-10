# Mojo 언어 종합 학습 리포트

> 작성일: 2026-03-10  |  버전: 0.2.0  |  상태: 계획 수립 완료
>
> **목표:** Python 문법으로 C++ 성능을 구현하는 Mojo 언어 완전 학습

---

## 📌 개요

**Mojo**는 2023년 Modular에서 공개한 신언어로, Python과 100% 호환되면서도 LLVM 기반 컴파일러로 C++ 수준의 성능을 제공합니다. AI/ML 워크로드 최적화에 특화되었으며, 2026년 기준으로 가장 혁신적인 언어로 평가받고 있습니다.

이 리포트는 10단계 로드맵을 통해 Mojo의 핵심 개념, 아키텍처, 성능 최적화 기법을 상세히 기록합니다.

---

## 🔥 왜 Mojo인가?

### 언어 비교표

| 항목 | Python | Mojo | Rust | C++ |
|------|--------|------|------|-----|
| 문법 친숙도 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| 성능 | 느림 (10-100배) | 매우 빠름 (1배) | 매우 빠름 (1배) | 매우 빠름 (1배) |
| 학습 난이도 | 매우 쉬움 | 쉬움 | 어려움 | 매우 어려움 |
| 메모리 안전 | GC (자동) | 자동 | 수동 (borrow) | 수동 |
| AI/ML 생태계 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| SIMD 지원 | 라이브러리 | 언어 수준 | 라이브러리 | 라이브러리 |
| 컴파일 속도 | 없음 (인터프리터) | 빠름 | 느림 | 빠름 |

### 핵심 특징

```
✨ Python 100% 호환성 (기존 코드 재사용 가능)
⚡ C++ 수준 성능 (LLVM 컴파일)
🔐 Type Safety (선택적 타입 명시)
🎯 AI/ML 최적화 (SIMD, 병렬화)
📦 자동 메모리 관리 (GC + Ownership)
🔗 Python 라이브러리 완전 통합
```

### Mojo의 차별점

**Python vs Mojo:**
```python
# Python: 동적 타입, 느린 실행
def matrix_multiply(A, B):
    return A @ B  # NumPy에 의존

# Mojo: 정적 타입, 자동 최적화
fn matrix_multiply(A: Matrix, B: Matrix) -> Matrix:
    # SIMD 자동 활용, 컴파일 시 최적화
    return A @ B
```

---

## 📚 Step 1: 환경 설정 & Hello World (⏳ 예정)

### 1.1 Mojo 설치

```bash
# 공식 설치 (macOS/Linux)
curl -sSL https://install.modular.com | bash

# 설치 확인
mojo --version
# mojo 0.7.x

# 개발 환경 설정
# VS Code: 확장 "Mojo" 검색 후 설치
code --install-extension modularml.vscode-mojo
```

### 1.2 첫 번째 프로그램

```mojo
# hello.mojo
fn main():
    print("Hello, Mojo! 🔥")
    print("Python 문법, C++ 성능")
```

**실행:**
```bash
mojo run hello.mojo
# 출력:
# Hello, Mojo! 🔥
# Python 문법, C++ 성능
```

### 1.3 Mojo vs Python 비교 실행

```mojo
# python_compat.mojo
# Mojo는 기존 Python 코드도 실행 가능

def python_style():
    # Python 스타일 (동적 타입)
    x = 5
    y = "hello"
    return x, y

fn mojo_style() -> (Int, String):
    # Mojo 스타일 (정적 타입)
    let x: Int = 5
    let y: String = "hello"
    return x, y

fn main():
    py_result = python_style()
    print(f"Python: {py_result}")

    mojo_result = mojo_style()
    print(f"Mojo: {mojo_result}")
```

### 1.4 컴파일 및 성능 측정

```bash
# JIT 컴파일 (개발)
mojo run hello.mojo

# AOT 컴파일 (배포)
mojo build hello.mojo -o hello
./hello

# 성능 통계
mojo build hello.mojo -o hello --stats
```

---

## 📚 Step 2: 기본 문법과 타입 (⏳ 예정)

### 2.1 변수 선언 (let vs var)

```mojo
fn main():
    # 불변 변수 (let)
    let name: String = "Alice"
    let age: Int = 30
    let pi: Float32 = 3.14

    # 가변 변수 (var, 컴파일러 권장 사항)
    var counter: Int = 0
    counter += 1  # OK

    # 타입 추론
    let x = 42          # Int (추론)
    let y = 3.14        # Float64 (추론)
    let message = "hi"  # String (추론)

    print(f"이름: {name}, 나이: {age}")
```

### 2.2 Mojo의 고유 타입 시스템

```mojo
# Mojo의 강력한 타입 시스템

fn process_int(x: Int) -> Int:
    # Int는 기본적으로 64bit
    return x * 2

fn process_simd(x: SIMD[DType.float32, 4]) -> SIMD[DType.float32, 4]:
    # SIMD 벡터 (4개 float32 동시 처리)
    return x * 2

struct Point:
    x: Float64
    y: Float64

fn main():
    # 정수
    a: Int = 42
    b: UInt8 = 255

    # 부동소수점
    c: Float32 = 3.14
    d: Float64 = 2.71828

    # 문자열
    s: String = "hello"

    # SIMD 벡터
    v = SIMD[DType.float32, 4](1.0, 2.0, 3.0, 4.0)

    # 구조체
    p = Point(x=10.0, y=20.0)
```

### 2.3 제어문 (if, for, while)

```mojo
fn control_flow_example() -> Int:
    let x = 10

    # if-else
    if x > 0:
        print("양수")
    elif x < 0:
        print("음수")
    else:
        print("영")

    # for 루프
    var sum = 0
    for i in range(1, 11):  # 1~10
        sum += i

    # while 루프
    var n = 1
    while n < 100:
        n *= 2

    return sum  # 55

fn main():
    result = control_flow_example()
    print(f"합계: {result}")
```

### 2.4 함수 (fn vs def)

```mojo
# fn: 정적 타입 (권장)
fn add(x: Int, y: Int) -> Int:
    return x + y

# def: 동적 타입 (Python 호환)
def multiply(x, y):
    return x * y

# 함수 오버로딩 (Mojo의 강력한 기능)
fn process(x: Int) -> Int:
    return x * 2

fn process(x: Float64) -> Float64:
    return x * 2.0

fn process(x: String) -> String:
    return x + x

fn main():
    print(add(3, 4))              # 7
    print(multiply(3, 4))         # 12
    print(process(5))             # 10 (Int 오버로딩)
    print(process(2.5))           # 5.0 (Float64 오버로딩)
    print(process("hi"))          # "hihi" (String 오버로딩)
```

---

## 📚 Step 3: 타입 시스템 (Value vs Reference) (⏳ 예정)

### 3.1 값 의미론 (Value Semantics)

```mojo
struct Point:
    x: Int
    y: Int

fn main():
    let p1 = Point(x=10, y=20)
    var p2 = p1  # 복사본 생성

    p2.x = 30

    print(f"p1: ({p1.x}, {p1.y})")  # (10, 20) - 변경되지 않음
    print(f"p2: ({p2.x}, {p2.y})")  # (30, 20)
```

### 3.2 참조 의미론 (Reference Semantics)

```mojo
class Node:
    data: Int
    next: Node | None

fn main():
    var n1 = Node(data=10, next=None)
    var n2 = n1  # 참조 복사

    n2.data = 20

    print(f"n1.data: {n1.data}")  # 20 (같은 객체)
    print(f"n2.data: {n2.data}")  # 20
```

### 3.3 옵션 타입 (Option)

```mojo
# Mojo의 Option 타입 (Python의 None 대체)

fn find_value(key: String, dict: Dict[String, Int]) -> Option[Int]:
    if key in dict:
        return Option(dict[key])
    return Option()  # None

fn main():
    data = Dict[String, Int]()
    data["a"] = 10

    match find_value("a", data):
        case Some(value):
            print(f"찾음: {value}")
        case None:
            print("찾지 못함")
```

---

## 📚 Step 4: 컬렉션과 메모리 (⏳ 예정)

### 4.1 리스트 (Dynamic Array)

```mojo
fn list_operations():
    var numbers: List[Int] = List[Int]()

    # 추가
    numbers.append(10)
    numbers.append(20)
    numbers.append(30)

    # 접근
    print(numbers[0])       # 10
    print(numbers.size)     # 3

    # 순회
    for num in numbers:
        print(num)

    # 슬라이싱
    slice = numbers[1:3]    # [20, 30]

fn main():
    list_operations()
```

### 4.2 고정 크기 배열 (SIMD)

```mojo
fn simd_operations():
    # SIMD: 4개 Float32를 동시에 처리
    let a = SIMD[DType.float32, 4](1.0, 2.0, 3.0, 4.0)
    let b = SIMD[DType.float32, 4](5.0, 6.0, 7.0, 8.0)

    # 벡터 연산 (매우 빠름)
    let c = a + b  # [6.0, 8.0, 10.0, 12.0]
    let d = a * b  # [5.0, 12.0, 21.0, 32.0]

    print("SIMD 덧셈 결과:")
    for i in range(4):
        print(c[i])

fn main():
    simd_operations()
```

### 4.3 딕셔너리

```mojo
fn dict_operations():
    var scores = Dict[String, Int]()

    scores["Alice"] = 95
    scores["Bob"] = 87
    scores["Charlie"] = 92

    # 안전한 접근
    if "Alice" in scores:
        print(f"Alice: {scores['Alice']}")

    # 순회
    for key in scores.keys():
        print(f"{key}: {scores[key]}")

fn main():
    dict_operations()
```

---

## 📚 Step 5: 소유권 (Ownership) (⏳ 예정)

### 5.1 소유권 개념

```mojo
# Mojo의 Ownership은 Rust와 유사하지만 더 간단함

struct Buffer:
    data: List[Int]

fn transfer_ownership(owned buffer: Buffer):
    # 함수 매개변수가 buffer의 소유권을 받음
    print(f"크기: {buffer.data.size}")
    # 함수 종료 시 자동으로 메모리 해제

fn main():
    var buf = Buffer(data=List[Int]())
    buf.data.append(10)

    transfer_ownership(owned buf)
    # buf는 더 이상 사용 불가능 (소유권 이전됨)
    # print(buf.data)  # 컴파일 에러!
```

### 5.2 빌린 참조 (Borrowed Arguments)

```mojo
fn process_without_owning(borrowed buffer: Buffer) -> Int:
    # 참조만 빌림 (소유권 미전달)
    return buffer.data.size

fn main():
    var buf = Buffer(data=List[Int]())
    buf.data.append(10)
    buf.data.append(20)

    size = process_without_owning(borrowed buf)
    print(f"크기: {size}")

    # buf는 여전히 사용 가능 (소유권 유지)
    print(f"여전히 사용 가능: {buf.data.size}")
```

---

## 📚 Step 6: 함수와 고차 프로그래밍 (⏳ 예정)

### 6.1 고차 함수 (Higher-Order Functions)

```mojo
fn apply_to_all(items: List[Int], func: fn(Int) -> Int) -> List[Int]:
    var results: List[Int] = List[Int]()
    for item in items:
        results.append(func(item))
    return results

fn double(x: Int) -> Int:
    return x * 2

fn square(x: Int) -> Int:
    return x * x

fn main():
    let numbers = List[Int](1, 2, 3, 4, 5)

    let doubled = apply_to_all(numbers, double)
    let squared = apply_to_all(numbers, square)

    print("Doubled:", doubled)  # [2, 4, 6, 8, 10]
    print("Squared:", squared)  # [1, 4, 9, 16, 25]
```

### 6.2 람다 함수

```mojo
fn map_with_lambda():
    let numbers = List[Int](1, 2, 3, 4, 5)

    # 람다를 사용한 고차 함수
    result = apply_to_all(numbers, fn(x: Int) -> Int { return x * 3 })

    print("3배 결과:", result)

fn main():
    map_with_lambda()
```

---

## 📚 Step 7: 구조체와 객체 (⏳ 예정)

### 7.1 구조체 정의와 메서드

```mojo
struct Rectangle:
    width: Float64
    height: Float64

    fn area(self) -> Float64:
        return self.width * self.height

    fn perimeter(self) -> Float64:
        return 2 * (self.width + self.height)

    fn scale(inout self, factor: Float64):
        self.width *= factor
        self.height *= factor

fn main():
    var rect = Rectangle(width=10.0, height=5.0)

    print(f"넓이: {rect.area()}")        # 50.0
    print(f"둘레: {rect.perimeter()}")   # 30.0

    rect.scale(2.0)
    print(f"확대 후 넓이: {rect.area()}")  # 200.0
```

### 7.2 생성자와 초기화

```mojo
struct Circle:
    radius: Float64

    fn __init__(inout self, radius: Float64):
        self.radius = radius

    fn area(self) -> Float64:
        return 3.14159 * self.radius * self.radius

    fn circumference(self) -> Float64:
        return 2 * 3.14159 * self.radius

fn main():
    let circle = Circle(radius=5.0)
    print(f"넓이: {circle.area()}")
    print(f"둘레: {circle.circumference()}")
```

---

## 📚 Step 8: Traits와 Protocols (⏳ 예정)

### 8.1 Trait 정의

```mojo
trait Drawable:
    fn draw(self):
        ...

trait Moveable:
    fn move(inout self, dx: Float64, dy: Float64):
        ...

struct Shape:
    x: Float64
    y: Float64

fn Shape:
    @implements(Drawable)
    fn draw(self):
        print(f"Shape at ({self.x}, {self.y})")

    @implements(Moveable)
    fn move(inout self, dx: Float64, dy: Float64):
        self.x += dx
        self.y += dy

fn main():
    var shape = Shape(x=0.0, y=0.0)
    shape.draw()
    shape.move(10.0, 20.0)
    shape.draw()
```

---

## 📚 Step 9: 성능 최적화 (⏳ 예정)

### 9.1 SIMD를 통한 벡터화

```mojo
# Python: 느린 루프 (수초)
def slow_multiply(a, b):
    result = []
    for i in range(len(a)):
        result.append(a[i] * b[i])
    return result

# Mojo: SIMD 활용 (밀리초)
fn fast_multiply(a: DynamicVector[Float32], b: DynamicVector[Float32])
  -> DynamicVector[Float32]:
    var result: DynamicVector[Float32] = DynamicVector[Float32]()

    # 4개씩 동시 처리
    alias simd_width = 4
    for i in range(0, len(a), simd_width):
        let va = a.load[simd_width](i)
        let vb = b.load[simd_width](i)
        result.store[simd_width](i, va * vb)

    return result
```

### 9.2 병렬 처리

```mojo
fn parallel_sum(items: DynamicVector[Float32]) -> Float32:
    # 병렬 루프
    var total: Float32 = 0.0

    @parallelized
    for i in range(len(items)):
        total += items[i]

    return total
```

---

## 📚 Step 10: AI/ML 프로젝트 (⏳ 예정)

### 10.1 간단한 행렬 연산

```mojo
struct Matrix:
    rows: Int
    cols: Int
    data: DynamicVector[Float32]

    fn __init__(inout self, rows: Int, cols: Int):
        self.rows = rows
        self.cols = cols
        self.data = DynamicVector[Float32](rows * cols)

    fn get(self, i: Int, j: Int) -> Float32:
        return self.data[i * self.cols + j]

    fn set(inout self, i: Int, j: Int, value: Float32):
        self.data[i * self.cols + j] = value

    fn multiply(self, other: Matrix) -> Matrix:
        var result = Matrix(rows=self.rows, cols=other.cols)

        # SIMD를 활용한 고속 곱셈
        for i in range(self.rows):
            for j in range(other.cols):
                var sum: Float32 = 0.0
                for k in range(self.cols):
                    sum += self.get(i, k) * other.get(k, j)
                result.set(i, j, sum)

        return result

fn main():
    let A = Matrix(rows=2, cols=2)
    let B = Matrix(rows=2, cols=2)

    # 값 설정
    var A_mut = A
    A_mut.set(0, 0, 1.0)
    A_mut.set(0, 1, 2.0)
    A_mut.set(1, 0, 3.0)
    A_mut.set(1, 1, 4.0)

    # ... 마찬가지로 B 설정 ...

    let C = A_mut.multiply(B)
    print(f"결과: {C.get(0, 0)}")
```

### 10.2 신경망 레이어

```mojo
struct NeuralLayer:
    weights: Matrix
    bias: DynamicVector[Float32]

    fn forward(self, input: DynamicVector[Float32])
      -> DynamicVector[Float32]:
        # 행렬-벡터 곱셈 + 편향
        var output: DynamicVector[Float32] = DynamicVector[Float32]()

        for i in range(self.weights.rows):
            var sum: Float32 = 0.0
            for j in range(self.weights.cols):
                sum += self.weights.get(i, j) * input[j]
            output.push_back(sum + self.bias[i])

        return output
```

---

## ⚠️ Mojo 학습 시 주의사항

### 1. Python과의 호환성 제약

```mojo
# ✅ 작동
def python_function():
    return {"a": 1, "b": 2}  # Dict 동적

# ❌ 제약
fn mojo_function() -> Dict[String, Int]:
    # 명시적 타입 필요
    var d = Dict[String, Int]()
    return d
```

### 2. SIMD 성능 최적화의 어려움

- 수동 벡터화 필요 (자동화 미완성)
- 데이터 정렬(alignment) 고려 필요

### 3. 커뮤니티 규모

- Python/Rust 대비 작은 생태계
- 라이브러리 부족 (개선 중)

---

## 📈 학습 진도 계획

```
Week 1  [           ] 0%   계획 수립 완료
Week 2  [====       ] 20%  Step 1-2 (기본 문법)
Week 3  [========   ] 40%  Step 3-4 (타입, 메모리)
Week 4  [============] 60% Step 5-6 (소유권, 함수)
Week 5  [===============] 80% Step 7-9 (구조체, 성능)
Week 6+ [====================] 100% Step 10 (AI/ML)
```

---

## 🔗 참고 리소스 및 학습 자료

| 리소스 | 링크 | 설명 |
|--------|------|------|
| 공식 문서 | docs.modular.com/mojo | 언어 완전 레퍼런스 |
| 튜토리얼 | modular.com/mojo/tutorials | 단계별 학습 가이드 |
| 플레이그라운드 | playground.modular.com | 브라우저에서 실행 |
| GitHub | github.com/modularml/mojo | 소스, 이슈, 토론 |
| Discord | 커뮤니티 | Q&A 및 실시간 지원 |
| YouTube | Modular 공식 채널 | 영상 튜토리얼 |

---

## 🎯 최종 목표 및 기대효과

학습 완료 후:
- ✅ Python 코드를 Mojo로 10배 이상 빠르게 작성 가능
- ✅ SIMD 및 병렬화를 통한 성능 최적화 이해
- ✅ AI/ML 워크로드에 최적화된 코드 작성 능력
- ✅ 타입 안전성과 성능의 균형 이해
- ✅ 실제 프로젝트 (작은 AI 모델) 완성

---

*최종 업데이트: 2026-03-10*
*작성자: Claude Haiku 4.5*
*패턴 학습 프로젝트 (V 언어 저장소 기반)*
