# Step 8: Trait과 Protocol

> 목표: 인터페이스, 트레이트, 프로토콜 완벽 이해

## 📋 학습 내용

1. Trait 정의
2. Protocol 구현
3. 다형성 (Polymorphism)
4. 인터페이스 설계
5. 제네릭과 Trait 바운드
6. Trait 합성

---

## Trait 정의

```mojo
trait Drawable:
    fn draw(self) -> None:
        ...

trait Comparable:
    fn compare(self, other) -> Int:
        ...
```

---

## Protocol 구현

```mojo
struct Circle:
    var radius: Int

fn draw(circle: Circle) -> None:
    print("Drawing circle")

struct Rectangle:
    var width: Int
    var height: Int

fn draw(rect: Rectangle) -> None:
    print("Drawing rectangle")
```

---

## 다형성

```mojo
fn process_shapes(shape_type: String) -> None:
    if shape_type == "circle":
        print("Circle processing")
    elif shape_type == "square":
        print("Square processing")
```

---

**작성일:** 2026-03-12
