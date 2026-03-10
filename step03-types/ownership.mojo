fn take_ownership(name: String) -> String:
    return "Hello, " + name + "!"

fn take_array(arr: List) -> Int:
    return len(arr)

fn use_string(s: String) -> String:
    return s + " - used"

fn create_string() -> String:
    return "Created string"

fn main():
    print("=== Ownership 개념 ===")
    print("")

    # 1. 소유권의 생성
    print("--- 소유권 생성 ---")
    let greeting = "Hello"
    print("greeting이 문자열의 소유권 보유")
    print("값: " + greeting)
    print("")

    # 2. 소유권 이전
    print("--- 소유권 이전 ---")
    let name = "Mojo"
    let result = take_ownership(name)
    print("take_ownership(name) 호출")
    print("결과: " + result)
    print("name의 소유권은 take_ownership으로 이전됨")
    # name을 이 후에 사용할 수 없음 (하지만 Mojo는 자동으로 처리)
    print("")

    # 3. 배열의 소유권
    print("--- 배열의 소유권 ---")
    var numbers = [1, 2, 3, 4, 5]
    let length = take_array(numbers)
    print("배열의 길이: " + str(length))
    print("배열의 소유권이 take_array에 이전됨")
    print("")

    # 4. 반환값으로 소유권 획득
    print("--- 반환값으로 소유권 획득 ---")
    let new_string = create_string()
    print("create_string()에서 반환된 문자열의 소유권 획득")
    print("값: " + new_string)
    print("")

    # 5. 소유권과 스코프
    print("--- 소유권과 스코프 ---")
    var scoped_var = "Scoped"
    print("scoped_var 소유권 있음: " + scoped_var)
    # scoped_var는 main() 함수가 종료될 때 자동으로 정리됨
    print("")

    # 6. 다중 소유권 (불가능)
    print("=== 소유권 규칙 ===")
    print("✓ 각 값은 정확히 하나의 소유자만 가짐")
    print("✓ 소유권을 이전할 수 있음")
    print("✓ 소유자 스코프 종료 시 값 자동 정리")
    print("✓ 컴파일 타임에 검증됨")
    print("")

    # 7. 소유권 이전의 실제 예
    print("--- 소유권 이전 예 ---")
    let original = "Original"
    let processed = use_string(original)
    print("original: " + original)
    print("processed: " + processed)
    print("Mojo는 자동으로 참조 처리를 최적화함")
