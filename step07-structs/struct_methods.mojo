fn main():
    print("=== 구조체 메서드 ===")
    print("")

    # 1. Rectangle 메서드 시뮬레이션
    print("--- Rectangle 메서드 ---")
    let rect_width = 10
    let rect_height = 5

    let rect_area = rect_width * rect_height
    let rect_perimeter = 2 * (rect_width + rect_height)

    print("Rectangle { width: " + str(rect_width) + ", height: " + str(rect_height) + " }")
    print("  area() → " + str(rect_area))
    print("  perimeter() → " + str(rect_perimeter))
    print("")

    # 2. Circle 메서드 시뮬레이션
    print("--- Circle 메서드 ---")
    let radius = 5
    let circle_area = radius * radius * 314 / 100  # 대략 π
    let circle_circumference = 2 * radius * 314 / 100

    print("Circle { radius: " + str(radius) + " }")
    print("  area() → " + str(circle_area))
    print("  circumference() → " + str(circle_circumference))
    print("")

    # 3. Person 메서드 시뮬레이션
    print("--- Person 메서드 ---")
    let person_name = "Alice"
    let person_age = 30
    let can_vote = person_age >= 18

    print("Person { name: \"" + person_name + "\", age: " + str(person_age) + " }")
    print("  can_vote() → " + str(can_vote))
    print("")

    # 4. Money 메서드 시뮬레이션
    print("--- Money 메서드 ---")
    let amount1 = 100
    let amount2 = 50
    let total = amount1 + amount2
    let difference = amount1 - amount2

    print("Money Operations:")
    print("  add(" + str(amount1) + ", " + str(amount2) + ") → " + str(total))
    print("  subtract(" + str(amount1) + ", " + str(amount2) + ") → " + str(difference))
    print("")

    # 5. String Builder 시뮬레이션
    print("--- StringBuilder 메서드 ---")
    var builder = "Hello"
    builder = builder + " "
    builder = builder + "Mojo"

    print("builder.append(\"Hello\")")
    print("builder.append(\" \")")
    print("builder.append(\"Mojo\")")
    print("result: " + builder)
    print("")

    # 6. 메서드 호출의 이점
    print("=== 메서드의 이점 ===")
    print("✓ 구조체와 함수 함께 관리")
    print("✓ 객체 지향 프로그래밍")
    print("✓ 캡슐화 (Encapsulation)")
    print("✓ 관련 기능 그룹화")
