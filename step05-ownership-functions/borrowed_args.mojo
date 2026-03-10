fn read_string(s: String) -> Int:
    return len(s)

fn process_array(arr: List) -> String:
    var count = 0
    for item in arr:
        count += 1
    return "Array has " + str(count) + " elements"

fn find_in_array(arr: List, target: Int) -> String:
    for i in range(len(arr)):
        if arr[i] == target:
            return "Found at index " + str(i)
    return "Not found"

fn print_info(text: String, count: Int) -> None:
    print("Text: " + text)
    print("Count: " + str(count))

fn main():
    print("=== 참조 차용 (Borrowing) ===")
    print("")

    # 1. 문자열 참조
    print("--- 문자열 참조 ---")
    let message = "Mojo Learning"
    let length = read_string(message)
    print("메시지: " + message)
    print("길이: " + str(length))
    print("message는 여전히 유효")
    print("")

    # 2. 배열 참조
    print("--- 배열 참조 ---")
    let numbers = [10, 20, 30, 40, 50]
    let info = process_array(numbers)
    print(info)
    print("numbers는 여전히 유효: [10, 20, 30, 40, 50]")
    print("")

    # 3. 배열 검색
    print("--- 배열 검색 (참조) ---")
    let items = [100, 200, 300, 400, 500]
    let search_result = find_in_array(items, 300)
    print(search_result)
    print("items은 변경되지 않음")
    print("")

    # 4. 다중 참조
    print("--- 다중 참조 (Multiple Borrows) ---")
    let text = "Hello World"
    let len1 = read_string(text)
    let len2 = read_string(text)
    print("첫 번째 호출: " + str(len1))
    print("두 번째 호출: " + str(len2))
    print("text는 여전히 유효")
    print("")

    # 5. 참조 vs 소유권 이전
    print("=== 참조 vs 소유권 이전 비교 ===")
    print("")
    print("참조 (Borrowing):")
    print("  - 함수가 값에 접근만 함")
    print("  - 원본이 유효함")
    print("  - 다중 참조 가능")
    print("  - 성능: 포인터 전달")
    print("")
    print("소유권 이전 (Move):")
    print("  - 함수가 값의 소유권 가짐")
    print("  - 원본 소유권 상실")
    print("  - 한 번에 하나만 가능")
    print("  - 성능: 메모리 이동")
