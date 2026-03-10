# Step 3: 타입 시스템 심화

> 목표: Mojo의 고급 타입 개념 완벽 이해

## 📋 학습 내용

1. 값 의미론 vs 참조 의미론
2. Ownership과 Borrowing
3. Option 타입 (null 안전)
4. Sum/Enum 타입
5. Trait과 Protocol
6. 제네릭 (Generic)
7. Type Constraints

---

## 값 의미론 (Value Semantics)

### 복사 의미론 (Copy by Default)

```mojo
fn main():
    let x = 5
    let y = x  # x 값이 y로 복사됨

    var arr = [1, 2, 3]
    var arr2 = arr  # 배열 전체 복사

    arr2[0] = 100
    print(str(arr[0]))   # 1 (원본 유지)
    print(str(arr2[0]))  # 100 (복사본만 변경)
```

### 이동 의미론 (Move Semantics)

```mojo
fn take_ownership(x: String) -> String:
    return x  # 소유권 이전

fn main():
    let name = "Mojo"
    let name2 = take_ownership(name)  # name 소유권 이전
    # print(name)  # ❌ 에러: name은 더 이상 유효하지 않음
```

---

## 참조 의미론 (Reference Semantics)

### 참조 전달 (Borrowed Reference)

```mojo
fn borrow_string(s: String) -> Int:
    return len(s)  # 참조로 사용

fn main():
    let text = "Hello"
    let length = borrow_string(text)
    print(str(length))
    print(text)  # ✅ text는 여전히 유효
```

---

## Ownership 개념

### 소유권 규칙

```mojo
fn main():
    # 1. 각 값은 하나의 소유자를 가짐
    let x = 42  # x가 42의 소유자

    # 2. 값을 다른 변수에 할당하면 소유권 이전
    let y = x  # x에서 y로 소유권 이전

    # 3. 스코프를 벗어나면 자동 정리
```

### 명시적 소유권 이전

```mojo
fn consume_value(x: String) -> String:
    return x + " processed"

fn main():
    let message = "Hello"
    let result = consume_value(message)
    # message는 consume_value에 의해 소유권 잃음
```

---

## Option 타입 (Null Safety)

### Option의 개념

```mojo
# Mojo에서는 Optional[T]로 표현
# Some(value) 또는 None

fn find_element(arr: List, target: Int) -> String:
    for item in arr:
        if item == target:
            return "Found"
    return "Not found"  # None 대신 기본값 반환

fn main():
    let numbers = [1, 2, 3, 4, 5]
    let result = find_element(numbers, 3)
    print(result)
```

### Option 처리

```mojo
fn divide(a: Int, b: Int) -> String:
    if b == 0:
        return "Error: division by zero"
    else:
        return str(a / b)

fn main():
    print(divide(10, 2))  # 5
    print(divide(10, 0))  # Error: division by zero
```

---

## Enum/Sum 타입

### 열거형

```mojo
# Mojo에서 Enum은 다음처럼 표현
fn get_status(code: Int) -> String:
    return match code {
        200 { "OK" }
        404 { "Not Found" }
        500 { "Server Error" }
        else { "Unknown" }
    }

fn main():
    print(get_status(200))   # OK
    print(get_status(404))   # Not Found
    print(get_status(999))   # Unknown
```

### Result 타입 (성공/실패)

```mojo
fn safe_divide(a: Int, b: Int) -> String:
    if b == 0:
        return "Err: Division by zero"
    else:
        return "Ok: " + str(a / b)

fn main():
    print(safe_divide(10, 2))
    print(safe_divide(10, 0))
```

---

## Trait과 Protocol

### Trait 정의 및 구현

```mojo
# Mojo에서는 protocol을 사용하여 인터페이스 정의
fn has_length(x: String) -> Bool:
    return len(x) > 0

fn print_length(x: String) -> None:
    print("Length: " + str(len(x)))

fn main():
    let text = "Hello"
    print_length(text)
```

### 구조체와 메서드

```mojo
# 구조체 및 메서드 (구현 예정)
struct Point:
    var x: Int
    var y: Int

fn main():
    let p = Point(3, 4)
```

---

## 제네릭 (Generic)

### 제네릭 함수

```mojo
fn swap_elements(arr: List, i: Int, j: Int) -> None:
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp

fn main():
    var numbers = [1, 2, 3, 4, 5]
    swap_elements(numbers, 0, 4)
    # [5, 2, 3, 4, 1]
```

### 제네릭 구조체

```mojo
# Mojo에서 제네릭 타입 구현은 고급 주제
# 기본적으로 리스트는 어떤 타입이든 저장 가능
fn main():
    let int_list = [1, 2, 3]
    let str_list = ["a", "b", "c"]
```

---

## Type Constraints

### 타입 제약

```mojo
fn process_number(x: Int) -> Int:
    if x < 0:
        return -x  # 절댓값
    return x

fn main():
    print(str(process_number(5)))
    print(str(process_number(-3)))
```

### 타입 검사

```mojo
fn is_positive(x: Int) -> Bool:
    return x > 0

fn main():
    print(str(is_positive(5)))    # true
    print(str(is_positive(-3)))   # false
    print(str(is_positive(0)))    # false
```

---

## Type Inference (타입 추론)

### 복잡한 타입 추론

```mojo
fn main():
    let x = 5 + 3         # Int로 추론
    let y = 3.14 * 2.0    # Float64로 추론
    let z = "Hello" + "!"  # String으로 추론

    # 명시적 타입이 필요한 경우
    let arr: List = [1, 2, 3]
```

---

## 모범 사례 (Best Practices)

### DO: 명확한 타입 지정
```mojo
fn calculate(x: Int, y: Int) -> Int:
    return x + y
```

### DON'T: 모호한 타입
```mojo
fn calculate(x, y):  # Python 방식, Mojo에서는 최소한 fn 사용 권장
    return x + y
```

### DO: Option 처리
```mojo
fn find(items: List, target: Int) -> String:
    for item in items:
        if item == target:
            return "Found"
    return "Not found"
```

### DON'T: Null 반환
```mojo
fn find(items: List, target: Int):
    # null 반환 금지 - 안전하지 않음
    pass
```

---

**작성일:** 2026-03-11
