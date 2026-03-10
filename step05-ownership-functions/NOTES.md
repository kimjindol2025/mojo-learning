# Step 5: 소유권과 고급 함수

> 목표: Ownership, Borrowing, 고차 함수 완벽 이해

## 📋 학습 내용

1. 소유권 이전 (Move Semantics)
2. 참조 차용 (Borrowing)
3. 소유권 규칙 및 제약
4. 고차 함수 (Higher-Order Functions)
5. 클로저 (Closure)
6. 함수 포인터

---

## 소유권 이전 (Move Semantics)

```mojo
fn transfer_ownership(name: String) -> String:
    return "Hello, " + name

fn main():
    let message = "Mojo"
    let result = transfer_ownership(message)
    # message 소유권은 transfer_ownership으로 이전됨
```

---

## 참조 차용 (Borrowing)

```mojo
fn borrow_array(arr: List) -> Int:
    return len(arr)  # 참조로 접근만 함

fn main():
    let numbers = [1, 2, 3]
    let size = borrow_array(numbers)
    # numbers는 여전히 유효
    print(str(numbers[0]))
```

---

## 고차 함수

```mojo
fn apply_twice(x: Int, f: String) -> Int:
    let result1 = apply_operation(x, f)
    return apply_operation(result1, f)

fn apply_operation(x: Int, op: String) -> Int:
    if op == "double":
        return x * 2
    elif op == "square":
        return x * x
    else:
        return x
```

---

## 클로저

```mojo
fn make_multiplier(factor: Int) -> fn(Int) -> Int:
    fn multiply(x: Int) -> Int:
        return x * factor
    return multiply

fn main():
    let double = make_multiplier(2)
    let triple = make_multiplier(3)
    print(str(double(5)))   # 10
    print(str(triple(5)))   # 15
```

---

## 모범 사례

### DO: 명확한 소유권 전달
```mojo
fn process(name: String) -> String:
    return name.upper()
```

### DON'T: 소유권 혼동
```mojo
def process(name):  # 불명확
    return name
```

---

**작성일:** 2026-03-12
