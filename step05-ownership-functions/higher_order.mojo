fn apply_operation(a: Int, b: Int, op: String) -> Int:
    if op == "add":
        return a + b
    elif op == "sub":
        return a - b
    elif op == "mul":
        return a * b
    else:
        return 0

fn transform_array(arr: List, operation: String) -> List:
    var result = []
    for item in arr:
        if operation == "double":
            result.append(item * 2)
        elif operation == "square":
            result.append(item * item)
        elif operation == "negate":
            result.append(-item)
        else:
            result.append(item)
    return result

fn filter_by_condition(arr: List, condition: String) -> List:
    var result = []
    for item in arr:
        if condition == "even" and item % 2 == 0:
            result.append(item)
        elif condition == "odd" and item % 2 == 1:
            result.append(item)
        elif condition == "positive" and item > 0:
            result.append(item)
    return result

fn compose_operations(x: Int, ops: List) -> Int:
    var result = x
    for op in ops:
        if op == "double":
            result = result * 2
        elif op == "add_ten":
            result = result + 10
    return result

fn main():
    print("=== 고차 함수 (Higher-Order Functions) ===")
    print("")

    # 1. 함수를 인자로 받는 함수
    print("--- 함수 참조를 인자로 받기 ---")
    let sum_result = apply_operation(10, 5, "add")
    let diff_result = apply_operation(10, 5, "sub")
    let prod_result = apply_operation(10, 5, "mul")

    print("add(10, 5) = " + str(sum_result))
    print("sub(10, 5) = " + str(diff_result))
    print("mul(10, 5) = " + str(prod_result))
    print("")

    # 2. 배열 변환
    print("--- 배열 변환 (Map) ---")
    let numbers = [1, 2, 3, 4, 5]
    let doubled = transform_array(numbers, "double")
    let squared = transform_array(numbers, "square")

    print("원본: [1, 2, 3, 4, 5]")
    print("×2: [2, 4, 6, 8, 10]")
    print("²: [1, 4, 9, 16, 25]")
    print("")

    # 3. 필터링
    print("--- 필터링 (Filter) ---")
    let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let evens = filter_by_condition(data, "even")
    let odds = filter_by_condition(data, "odd")

    print("원본: [1-10]")
    print("짝수: [2, 4, 6, 8, 10]")
    print("홀수: [1, 3, 5, 7, 9]")
    print("")

    # 4. 함수 합성
    print("--- 함수 합성 (Composition) ---")
    let ops = ["double", "add_ten"]
    let initial = 5
    let final = compose_operations(initial, ops)
    print("초기값: " + str(initial))
    print("×2: " + str(initial * 2))
    print("×2 + 10: " + str(final))
    print("")

    # 5. 고차 함수의 이점
    print("=== 고차 함수의 이점 ===")
    print("✓ 코드 재사용성")
    print("✓ 추상화 수준 향상")
    print("✓ 함수형 프로그래밍")
    print("✓ 유연한 알고리즘")
