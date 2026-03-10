# Step 2: 기본 문법과 타입

> 목표: Mojo의 변수, 타입, 제어문, 함수 완벽 이해

## 📋 학습 내용

1. 변수 선언 (let vs var)
2. 기본 타입 (Int, Float, String, Bool)
3. 타입 추론
4. 문자열 보간
5. 제어문 (if-else, match)
6. 반복문 (for, while)
7. 함수 정의 (fn vs def)
8. 함수 오버로딩

---

## 변수 선언

### let (불변)
```mojo
fn main():
    let x = 5       # 불변 (재할당 불가)
    let y: Int = 10 # 명시적 타입
    # x = 6         # ❌ 에러
```

### var (가변)
```mojo
fn main():
    var count = 0
    count = 1       # ✅ 가능
    count += 5      # ✅ 가능
```

---

## 기본 타입

| 타입 | 범위 | 예시 |
|------|------|------|
| Int | 64비트 정수 | 42 |
| Int8/16/32 | 8/16/32비트 | 127 |
| Float32 | 32비트 부동소수점 | 3.14 |
| Float64 | 64비트 부동소수점 | 3.14159 |
| Bool | 진리값 | true, false |
| String | 문자열 | "hello" |
| Char | 단일 문자 | 'A' |

---

## 제어문

### if-else
```mojo
fn check(x: Int) -> String:
    if x > 0:
        return "양수"
    elif x < 0:
        return "음수"
    else:
        return "영"
```

### match (switch)
```mojo
fn day_name(day: Int) -> String:
    return match day {
        1 { "월요일" }
        2 { "화요일" }
        3 { "수요일" }
        4 { "목요일" }
        5 { "금요일" }
        6, 7 { "주말" }
        else { "잘못됨" }
    }
```

---

## 반복문

### for 루프
```mojo
fn main():
    # 범위 루프
    for i in range(5):
        print(str(i))

    # 배열 순회
    let arr = [1, 2, 3]
    for item in arr:
        print(str(item))
```

### while 루프
```mojo
fn main():
    var n = 1
    while n < 100:
        n *= 2
    print(str(n))
```

---

## 함수

### fn (정적 타입, 권장)
```mojo
fn add(a: Int, b: Int) -> Int:
    return a + b

fn main():
    result = add(5, 3)
    print(str(result))  # 8
```

### def (동적 타입, Python 호환)
```mojo
def multiply(x, y):
    return x * y

fn main():
    result = multiply(4, 5)
    print(str(result))  # 20
```

### 함수 오버로딩
```mojo
fn process(x: Int) -> Int:
    return x * 2

fn process(x: Float64) -> Float64:
    return x * 2.0

fn process(x: String) -> String:
    return x + x

fn main():
    print(str(process(5)))      # 10
    print(str(process(2.5)))    # 5.0
    print(process("hi"))         # hihi
```

---

## 문자열 보간

```mojo
fn main():
    name = "Mojo"
    version = 7

    # 문자열 보간
    msg = f"Language: {name}, Version: {version}"
    print(msg)
```

---

**작성일:** 2026-03-10
