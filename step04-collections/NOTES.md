# Step 4: 컬렉션과 자료구조

> 목표: Mojo의 컬렉션 타입과 SIMD 벡터화 이해

## 📋 학습 내용

1. 배열 (Array/List)
2. 딕셔너리 (Dictionary)
3. 투플 (Tuple)
4. 집합 (Set)
5. SIMD 벡터 연산
6. 컬렉션 순회
7. 컬렉션 변환

---

## 배열 (Array/List)

### 배열 생성

```mojo
fn main():
    let empty_arr = []
    let numbers = [1, 2, 3, 4, 5]
    let strings = ["a", "b", "c"]
    let mixed = [1, "two", 3]  # 혼합 타입
```

### 배열 접근

```mojo
fn main():
    let arr = [10, 20, 30, 40, 50]

    # 인덱스 접근
    let first = arr[0]      # 10
    let last = arr[4]       # 50

    # 범위 접근
    let slice = arr  # 복사본
```

### 배열 수정

```mojo
fn main():
    var arr = [1, 2, 3]

    # 요소 수정
    arr[0] = 100

    # 요소 추가
    arr.append(4)

    # 요소 제거
    arr.pop()
```

### 배열 메서드

```mojo
fn main():
    var arr = [3, 1, 4, 1, 5, 9]

    let length = len(arr)
    let is_empty = len(arr) == 0

    arr.sort()  # 정렬
    arr.reverse()  # 역순
```

---

## 딕셔너리 (Dictionary)

### 딕셔너리 생성

```mojo
fn main():
    # 딕셔너리 생성
    var person = {}
    person["name"] = "Alice"
    person["age"] = "30"
    person["city"] = "Seoul"
```

### 딕셔너리 접근

```mojo
fn main():
    var dict = {}
    dict["key"] = "value"

    let value = dict["key"]

    # 존재 확인
    if "key" in dict:
        print("Key exists")
```

### 딕셔너리 순회

```mojo
fn main():
    var dict = {}
    dict["a"] = "1"
    dict["b"] = "2"

    for key in dict:  # 키로 순회
        print(key)
```

---

## SIMD 벡터 연산

### SIMD 개념

```mojo
# SIMD (Single Instruction Multiple Data)
# 한 번의 명령으로 여러 데이터 처리

fn main():
    # 벡터 연산
    let v1 = [1, 2, 3, 4]
    let v2 = [5, 6, 7, 8]

    # 각 요소별 덧셈
    var result = [0, 0, 0, 0]
    for i in range(4):
        result[i] = v1[i] + v2[i]
```

### 병렬 처리

```mojo
fn main():
    let data = [1, 2, 3, 4, 5, 6, 7, 8]

    # 각 요소에 2를 곱함
    var doubled = []
    for item in data:
        doubled.append(item * 2)
```

---

## 컬렉션 순회

### for 루프

```mojo
fn main():
    let items = [1, 2, 3, 4, 5]

    # 값으로 순회
    for item in items:
        print(str(item))

    # 인덱스로 순회
    for i in range(len(items)):
        print(str(i) + ": " + str(items[i]))
```

### enumerate

```mojo
fn main():
    let items = ["a", "b", "c"]

    # (인덱스, 값) 쌍으로 순회
    for i in range(len(items)):
        print(str(i) + ": " + items[i])
```

### 필터링과 맵핑

```mojo
fn main():
    let numbers = [1, 2, 3, 4, 5]

    # 필터링
    var evens = []
    for num in numbers:
        if num % 2 == 0:
            evens.append(num)

    # 맵핑
    var squared = []
    for num in numbers:
        squared.append(num * num)
```

---

## 컬렉션 변환

### 리스트 → 문자열

```mojo
fn main():
    let numbers = [1, 2, 3]
    let str_items = ""
    for num in numbers:
        str_items = str_items + str(num) + ", "
```

### 문자열 → 리스트

```mojo
fn main():
    let text = "hello"
    var chars = []
    for i in range(len(text)):
        chars.append(text[i])
```

---

## 성능 최적화

### 메모리 효율

```mojo
fn main():
    # 배열은 값 의미론
    var original = [1, 2, 3, 4, 5]
    var copy = original  # 복사

    # SIMD로 처리하면 성능 향상
    var result = [0, 0, 0, 0, 0]
    for i in range(5):
        result[i] = original[i] * 2
```

### 캐시 최적화

```mojo
fn main():
    # 연속적 메모리 접근
    let size = 1000
    var arr = [0] * size

    for i in range(size):
        arr[i] = i * 2
```

---

## 모범 사례

### DO: 적절한 자료구조 선택
```mojo
var names = []  # 순서가 중요하면 배열
var scores = {}  # 키-값 관계면 딕셔너리
```

### DON'T: 부적절한 자료구조
```mojo
var nums = {}  # 배열이 필요하면 배열 사용
num["0"] = 1
num["1"] = 2
```

---

**작성일:** 2026-03-11
