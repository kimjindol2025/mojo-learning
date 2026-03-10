fn print_array(arr: List) -> None:
    print("[" + str(arr[0]), end="")
    for i in range(1, len(arr)):
        print(", " + str(arr[i]), end="")
    print("]")

fn sum_array(arr: List) -> Int:
    var total = 0
    for item in arr:
        total += item
    return total

fn find_max(arr: List) -> Int:
    var max_val = arr[0]
    for item in arr:
        if item > max_val:
            max_val = item
    return max_val

fn find_min(arr: List) -> Int:
    var min_val = arr[0]
    for item in arr:
        if item < min_val:
            min_val = item
    return min_val

fn main():
    print("=== 배열 (Array/List) ===")
    print("")

    # 1. 배열 생성
    print("--- 배열 생성 ---")
    let numbers = [1, 2, 3, 4, 5]
    let strings = ["apple", "banana", "cherry"]
    let empty = []

    print("숫자 배열:")
    print_array(numbers)
    print("")

    print("문자열 배열:")
    for str_item in strings:
        print("  - " + str_item)
    print("")

    # 2. 배열 접근
    print("--- 배열 접근 ---")
    print("첫 번째: " + str(numbers[0]))
    print("마지막: " + str(numbers[len(numbers) - 1]))
    print("중간: " + str(numbers[2]))
    print("")

    # 3. 배열 길이
    print("--- 배열 길이 ---")
    print("numbers의 길이: " + str(len(numbers)))
    print("strings의 길이: " + str(len(strings)))
    print("empty의 길이: " + str(len(empty)))
    print("")

    # 4. 배열 순회
    print("--- 배열 순회 (값) ---")
    for item in numbers:
        print("  " + str(item))
    print("")

    # 5. 배열 순회 (인덱스)
    print("--- 배열 순회 (인덱스) ---")
    for i in range(len(numbers)):
        print("  [" + str(i) + "] = " + str(numbers[i]))
    print("")

    # 6. 배열 계산
    print("--- 배열 계산 ---")
    print("합계: " + str(sum_array(numbers)))
    print("최댓값: " + str(find_max(numbers)))
    print("최솟값: " + str(find_min(numbers)))
    print("")

    # 7. 배열 복사
    print("--- 배열 복사 (값 의미론) ---")
    var original = [1, 2, 3]
    var copy = original
    copy[0] = 100

    print("original[0]: " + str(original[0]) + " (변경 안됨)")
    print("copy[0]: " + str(copy[0]) + " (변경됨)")
    print("")

    # 8. 배열 수정
    print("--- 배열 수정 ---")
    var mutable_arr = [10, 20, 30]
    print("수정 전: [10, 20, 30]")
    mutable_arr[1] = 200
    print("수정 후: [10, 200, 30]")
    print("")

    # 9. 배열 범위
    print("--- 범위 배열 ---")
    var range_arr = []
    for i in range(1, 6):
        range_arr.append(i)
    print("range(1, 6): ")
    print_array(range_arr)
