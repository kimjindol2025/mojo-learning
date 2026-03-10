fn array_to_string(arr: List, separator: String) -> String:
    if len(arr) == 0:
        return ""

    var result = str(arr[0])
    for i in range(1, len(arr)):
        result = result + separator + str(arr[i])
    return result

fn string_to_array(text: String) -> List:
    var chars = []
    for i in range(len(text)):
        chars.append(text[i])
    return chars

fn split_string(text: String, delimiter: String) -> List:
    var parts = []
    var current = ""
    for i in range(len(text)):
        if i < len(text) - 1 and text[i] == delimiter[0]:
            parts.append(current)
            current = ""
        else:
            current = current + text[i]
    if len(current) > 0:
        parts.append(current)
    return parts

fn flatten_2d(matrix: List) -> List:
    var flat = []
    for row in matrix:
        for item in row:
            flat.append(item)
    return flat

fn find_duplicates(arr: List) -> List:
    var duplicates = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                var found = false
                for dup in duplicates:
                    if dup == arr[i]:
                        found = true
                        break
                if not found:
                    duplicates.append(arr[i])
    return duplicates

fn main():
    print("=== 컬렉션 변환 ===")
    print("")

    # 1. 배열 → 문자열
    print("--- 배열을 문자열로 변환 ---")
    let numbers = [1, 2, 3, 4, 5]
    let str_nums = array_to_string(numbers, ", ")
    print("배열: [1, 2, 3, 4, 5]")
    print("문자열: " + str_nums)
    print("")

    # 2. 다양한 구분자
    print("--- 다양한 구분자 ---")
    let words = ["hello", "world", "mojo"]
    let space_joined = array_to_string(words, " ")
    let dash_joined = array_to_string(words, "-")
    let dot_joined = array_to_string(words, ".")

    print("공백 구분: " + space_joined)
    print("대시 구분: " + dash_joined)
    print("점 구분: " + dot_joined)
    print("")

    # 3. 문자열 → 배열
    print("--- 문자열을 배열로 변환 ---")
    let text = "Mojo"
    let chars = string_to_array(text)
    print("문자열: " + text)
    print("문자 배열 길이: " + str(len(chars)))
    print("문자들:")
    for i in range(len(chars)):
        print("  [" + str(i) + "] = " + chars[i])
    print("")

    # 4. 문자열 분할
    print("--- 문자열 분할 (Split) ---")
    let csv = "apple,banana,cherry,date"
    let fruits = split_string(csv, ",")
    print("CSV: " + csv)
    print("분할 결과:")
    for fruit in fruits:
        print("  • " + fruit)
    print("")

    # 5. 2D 배열 평탄화
    print("--- 2D 배열 평탄화 ---")
    let matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    print("2D 배열:")
    print("  [1, 2, 3]")
    print("  [4, 5, 6]")
    print("  [7, 8, 9]")

    let flat = flatten_2d(matrix)
    print("평탄화: " + array_to_string(flat, ", "))
    print("")

    # 6. 원본과 역순
    print("--- 배열 역순 ---")
    let original = [10, 20, 30, 40]
    var reversed_arr = []
    for i in range(len(original) - 1, -1, -1):
        reversed_arr.append(original[i])

    print("원본: " + array_to_string(original, ", "))
    print("역순: " + array_to_string(reversed_arr, ", "))
    print("")

    # 7. 필터링 (중복 제거)
    print("--- 중복 제거 ---")
    let with_duplicates = [1, 2, 2, 3, 4, 4, 4, 5]
    let duplicates = find_duplicates(with_duplicates)
    print("원본: " + array_to_string(with_duplicates, ", "))
    print("찾은 중복: " + array_to_string(duplicates, ", "))
    print("")

    # 8. 딕셔너리 → 배열
    print("--- 딕셔너리 변환 ---")
    var scores = {}
    scores["alice"] = "95"
    scores["bob"] = "87"
    scores["carol"] = "92"

    print("딕셔너리:")
    for name in scores:
        print("  " + name + ": " + scores[name])

    var keys = []
    var values = []
    for key in scores:
        keys.append(key)
        values.append(scores[key])

    print("키 배열: " + array_to_string(keys, ", "))
    print("값 배열: " + array_to_string(values, ", "))
    print("")

    # 9. 컬렉션 변환의 이점
    print("=== 컬렉션 변환의 이점 ===")
    print("✓ 데이터 형식 변환")
    print("✓ 서로 다른 도메인 연결")
    print("✓ 입출력 데이터 처리")
    print("✓ 알고리즘 최적화")
