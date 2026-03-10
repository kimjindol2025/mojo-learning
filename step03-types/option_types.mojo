fn safe_divide(a: Int, b: Int) -> String:
    if b == 0:
        return "Error: Division by zero"
    else:
        return str(a / b)

fn find_index(arr: List, target: Int) -> String:
    for i in range(len(arr)):
        if arr[i] == target:
            return str(i)
    return "Not found"

fn validate_age(age: Int) -> String:
    if age < 0:
        return "Error: Negative age"
    elif age < 18:
        return "Underage"
    else:
        return "Adult"

fn validate_email(email: String) -> String:
    if len(email) == 0:
        return "Error: Empty email"
    elif email.count("@") != 1:
        return "Error: Invalid email format"
    else:
        return "Valid"

fn get_first_element(arr: List) -> String:
    if len(arr) == 0:
        return "Error: Empty array"
    else:
        return str(arr[0])

fn main():
    print("=== Option 타입 (안전한 값 처리) ===")
    print("")

    # 1. 나눗셈 안전 처리
    print("--- 안전한 나눗셈 ---")
    print("10 ÷ 2 = " + safe_divide(10, 2))
    print("10 ÷ 0 = " + safe_divide(10, 0))
    print("")

    # 2. 배열 검색
    print("--- 배열 요소 검색 ---")
    let numbers = [10, 20, 30, 40, 50]
    print("배열에서 30의 위치: " + find_index(numbers, 30))
    print("배열에서 100의 위치: " + find_index(numbers, 100))
    print("")

    # 3. 나이 유효성 검증
    print("--- 나이 유효성 검증 ---")
    print("나이 15: " + validate_age(15))
    print("나이 25: " + validate_age(25))
    print("나이 -5: " + validate_age(-5))
    print("")

    # 4. 이메일 유효성 검증
    print("--- 이메일 유효성 검증 ---")
    print("'user@example.com': " + validate_email("user@example.com"))
    print("'invalid-email': " + validate_email("invalid-email"))
    print("'': " + validate_email(""))
    print("")

    # 5. 배열의 첫 번째 요소 안전하게 가져오기
    print("--- 배열 첫 요소 접근 ---")
    let arr1 = [100, 200, 300]
    let arr2 = []

    print("arr1[0]: " + get_first_element(arr1))
    print("arr2[0]: " + get_first_element(arr2))
    print("")

    # 6. Option 패턴 매칭
    print("=== Option 처리 패턴 ===")

    # 패턴 1: 조건 체크
    let value = 42
    if value > 0:
        print("패턴 1: 조건 체크 - " + str(value) + "는 양수")

    print("")

    # 패턴 2: 기본값 제공
    let maybe_number = 100
    let num = maybe_number  # 항상 유효한 값
    print("패턴 2: 기본값 제공 - " + str(num))

    print("")

    # 7. Option의 이점
    print("=== Option 타입의 이점 ===")
    print("✓ null pointer 에러 방지")
    print("✓ 컴파일 타임에 에러 감지")
    print("✓ 명시적 에러 처리")
    print("✓ 안전한 함수 계약 (contract)")
