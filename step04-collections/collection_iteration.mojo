fn print_list(label: String, items: List) -> None:
    print(label + ": [", end="")
    for i in range(len(items)):
        print(str(items[i]), end="")
        if i < len(items) - 1:
            print(", ", end="")
    print("]")

fn filter_even(numbers: List) -> List:
    var result = []
    for num in numbers:
        if num % 2 == 0:
            result.append(num)
    return result

fn filter_greater_than(numbers: List, threshold: Int) -> List:
    var result = []
    for num in numbers:
        if num > threshold:
            result.append(num)
    return result

fn double_elements(numbers: List) -> List:
    var result = []
    for num in numbers:
        result.append(num * 2)
    return result

fn sum_elements(numbers: List) -> Int:
    var total = 0
    for num in numbers:
        total += num
    return total

fn main():
    print("=== 컬렉션 순회 ===")
    print("")

    # 1. 기본 순회
    print("--- 기본 순회 (for-in) ---")
    let fruits = ["apple", "banana", "cherry", "date"]
    print("과일 목록:")
    for fruit in fruits:
        print("  • " + fruit)
    print("")

    # 2. 인덱스 기반 순회
    print("--- 인덱스 기반 순회 ---")
    let numbers = [10, 20, 30, 40, 50]
    print("번호가 매겨진 리스트:")
    for i in range(len(numbers)):
        print("  [" + str(i) + "] = " + str(numbers[i]))
    print("")

    # 3. 역순 순회
    print("--- 역순 순회 ---")
    let items = [1, 2, 3, 4, 5]
    print("역순:")
    for i in range(len(items) - 1, -1, -1):
        print("  " + str(items[i]))
    print("")

    # 4. 필터링 (짝수 찾기)
    print("--- 필터링: 짝수 찾기 ---")
    let all_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let evens = filter_even(all_numbers)
    print_list("모든 수", all_numbers)
    print_list("짝수", evens)
    print("")

    # 5. 필터링 (조건)
    print("--- 필터링: 5 초과 찾기 ---")
    let greater = filter_greater_than(all_numbers, 5)
    print_list("5 초과", greater)
    print("")

    # 6. 맵핑 (변환)
    print("--- 맵핑: 각 요소 2배 ---")
    let original = [1, 2, 3, 4, 5]
    let doubled = double_elements(original)
    print_list("원본", original)
    print_list("2배", doubled)
    print("")

    # 7. 축약 (Reduce)
    print("--- 축약: 합계 구하기 ---")
    let values = [10, 20, 30, 40]
    let sum_val = sum_elements(values)
    print_list("값", values)
    print("합계: " + str(sum_val))
    print("")

    # 8. 중첩 순회
    print("--- 중첩 순회: 구구단 ---")
    for i in range(2, 5):
        print(str(i) + "단:")
        for j in range(1, 4):
            print("  " + str(i) + " × " + str(j) + " = " + str(i * j))
    print("")

    # 9. 조건부 순회
    print("--- 조건부 순회: break/continue ---")
    print("0부터 10까지 (3에서 멈춤):")
    for i in range(10):
        if i == 3:
            print("  " + str(i) + " - 여기서 멈춤!")
            break
        print("  " + str(i))
    print("")

    # 10. 딕셔너리 순회
    print("--- 딕셔너리 순회 ---")
    var settings = {}
    settings["theme"] = "dark"
    settings["language"] = "korean"
    settings["notifications"] = "on"

    print("설정:")
    for key in settings:
        print("  " + key + " = " + settings[key])
