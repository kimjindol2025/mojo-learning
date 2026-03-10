# Step 7: 구조체와 메서드

> 목표: 구조체, 메서드, 초기화 완벽 이해

## 📋 학습 내용

1. 구조체 정의
2. 필드 (Properties)
3. 메서드 (Methods)
4. 생성자 (Constructor)
5. 자가 참조 (self)
6. 구조체의 소유권

---

## 구조체 정의

```mojo
struct Point:
    var x: Int
    var y: Int

fn main():
    let p = Point(3, 4)
    print(str(p.x))
    print(str(p.y))
```

---

## 메서드

```mojo
struct Rectangle:
    var width: Int
    var height: Int

    fn area(self) -> Int:
        return self.width * self.height

    fn perimeter(self) -> Int:
        return 2 * (self.width + self.height)
```

---

## 생성자

```mojo
struct Person:
    var name: String
    var age: Int

    fn __init__(self, name: String, age: Int):
        self.name = name
        self.age = age
```

---

## 메서드 체이닝

```mojo
struct Builder:
    var value: String

    fn append(self, s: String) -> Builder:
        return Builder(self.value + s)
```

---

**작성일:** 2026-03-12
