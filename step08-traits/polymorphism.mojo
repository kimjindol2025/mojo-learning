fn process_shape(shape_type: String) -> None:
    if shape_type == "circle":
        print("Circle:")
        print("  area() → πr²")
        print("  circumference() → 2πr")
    elif shape_type == "rectangle":
        print("Rectangle:")
        print("  area() → w × h")
        print("  perimeter() → 2(w + h)")
    elif shape_type == "triangle":
        print("Triangle:")
        print("  area() → (b × h) / 2")
        print("  perimeter() → a + b + c")

fn calculate_area(shape_type: String, param1: Int, param2: Int = 0) -> Int:
    if shape_type == "circle":
        return param1 * param1 * 314 / 100
    elif shape_type == "rectangle":
        return param1 * param2
    elif shape_type == "triangle":
        return (param1 * param2) / 2
    else:
        return 0

fn main():
    print("=== 다형성 (Polymorphism) ===")
    print("")

    # 1. Shape 인터페이스
    print("--- Shape 인터페이스 ---")
    let shapes = ["circle", "rectangle", "triangle"]
    for shape in shapes:
        process_shape(shape)
        print("")

    # 2. 면적 계산 (다형성)
    print("--- 다형 면적 계산 ---")
    let circle_area = calculate_area("circle", 5)
    let rect_area = calculate_area("rectangle", 10, 5)
    let tri_area = calculate_area("triangle", 10, 4)

    print("circle(r=5) 면적: " + str(circle_area))
    print("rectangle(w=10, h=5) 면적: " + str(rect_area))
    print("triangle(b=10, h=4) 면적: " + str(tri_area))
    print("")

    # 3. Animal 다형성
    print("--- Animal 다형성 ---")
    let animals = ["dog", "cat", "bird"]
    for animal in animals:
        if animal == "dog":
            print("Dog: Woof!")
        elif animal == "cat":
            print("Cat: Meow!")
        elif animal == "bird":
            print("Bird: Tweet!")
    print("")

    # 4. Vehicle 다형성
    print("--- Vehicle 다형성 ---")
    let vehicles = ["car", "bike", "plane"]
    for vehicle in vehicles:
        if vehicle == "car":
            print("Car: 4 wheels, drive on road")
        elif vehicle == "bike":
            print("Bike: 2 wheels, drive on road")
        elif vehicle == "plane":
            print("Plane: 0 wheels, fly in sky")
    print("")

    # 5. 다형성의 이점
    print("=== 다형성의 이점 ===")
    print("✓ 인터페이스 통일")
    print("✓ 유연한 설계")
    print("✓ 코드 재사용성")
    print("✓ 확장 용이")
