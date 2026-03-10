# Step 6: 고급 함수와 람다

> 목표: 함수 포인터, 람다식, 클로저 완벽 이해

## 📋 학습 내용

1. 함수 포인터 (Function Pointers)
2. 람다식 (Lambda Expressions)
3. 클로저 (Closures)
4. 함수 조합 (Function Composition)
5. 재귀 함수
6. 꼬리 재귀 최적화

---

## 함수 포인터

```mojo
fn apply(op: String, a: Int, b: Int) -> Int:
    if op == "add":
        return a + b
    else:
        return a - b
```

---

## 람다식 (Lambda)

```mojo
fn process_with_lambda(x: Int) -> Int:
    # 인라인 함수 정의
    let double = 2 * x
    return double
```

---

## 클로저

```mojo
fn make_adder(x: Int) -> fn(Int) -> Int:
    fn add(y: Int) -> Int:
        return x + y
    return add
```

---

## 재귀 함수

```mojo
fn factorial(n: Int) -> Int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

fn fibonacci(n: Int) -> Int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

---

## 꼬리 재귀

```mojo
fn factorial_tail(n: Int, acc: Int = 1) -> Int:
    if n <= 1:
        return acc
    return factorial_tail(n - 1, n * acc)
```

---

**작성일:** 2026-03-12
