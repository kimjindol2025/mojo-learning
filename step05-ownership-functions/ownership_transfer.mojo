fn consume_string(s: String) -> String:
    return s + " consumed"

fn use_array(arr: List) -> Int:
    return len(arr)

fn return_value() -> String:
    return "Created and returned"

fn main():
    print("=== 소유권 이전 (Move Semantics) ===")
    print("")

    # 1. 함수로 소유권 전달
    print("--- 함수로 소유권 전달 ---")
    let original = "Hello"
    let result = consume_string(original)
    print("original → consume_string()")
    print("결과: " + result)
    print("")

    # 2. 배열 소유권 이전
    print("--- 배열 소유권 이전 ---")
    var arr = [1, 2, 3, 4, 5]
    let size = use_array(arr)
    print("arr의 길이: " + str(size))
    print("arr은 use_array에 의해 소유권 이전")
    print("")

    # 3. 반환값으로 소유권 획득
    print("--- 반환값으로 소유권 획득 ---")
    let new_string = return_value()
    print("new_string이 반환값의 소유권 획득")
    print("값: " + new_string)
    print("")

    # 4. 소유권과 스코프
    print("--- 소유권과 스코프 ---")
    var scoped = "Scoped"
    print("scoped 생성: " + scoped)
    # scoped가 스코프를 벗어나면 자동 정리
    print("")

    # 5. 소유권 규칙
    print("=== 소유권의 3가지 규칙 ===")
    print("1. 각 값은 정확히 하나의 소유자만 가짐")
    print("2. 소유자가 변경되면 이전 소유자는 접근 불가")
    print("3. 소유자가 스코프를 벗어나면 값 자동 정리")
