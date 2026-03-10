fn borrow_string(s: String) -> Int:
    return len(s)

fn process_string(s: String) -> String:
    return s + " processed"

fn print_array_info(arr: List) -> None:
    print("배열의 길이: " + str(len(arr)))
    for item in arr:
        print("  - " + str(item))

fn modify_first(arr: List, new_value: Int) -> None:
    arr[0] = new_value

fn main():
    print("=== 참조 의미론 (Reference Semantics) ===")
    print("")

    # 참조 전달
    print("--- 함수의 참조 전달 ---")
    let text = "Hello"
    let length = borrow_string(text)
    print("문자열: " + text)
    print("길이: " + str(length))
    print("text는 borrow_string 후에도 유효")
    print("")

    # 문자열 처리
    print("--- 문자열 참조 처리 ---")
    let message = "Hello"
    let processed = process_string(message)
    print("원본: " + message)
    print("처리됨: " + processed)
    print("")

    # 배열 참조
    print("--- 배열 참조 전달 ---")
    var numbers = [1, 2, 3, 4, 5]
    print("원본 배열:")
    print_array_info(numbers)
    print("")

    # 배열 수정
    print("--- 배열 요소 수정 ---")
    var arr = [10, 20, 30]
    print("수정 전: " + str(arr[0]) + ", " + str(arr[1]) + ", " + str(arr[2]))
    modify_first(arr, 100)
    print("첫 번째 요소를 100으로 수정 후: " + str(arr[0]))
    print("")

    # 참조의 유효성
    print("=== 참조의 특징 ===")
    print("✓ 원본 데이터 접근")
    print("✓ 메모리 효율적")
    print("✓ 함수 간 데이터 공유 용이")
    print("✓ 부작용 (side effect) 가능")
