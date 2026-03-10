fn main():
    print("=== 값 의미론 (Value Semantics) ===")
    print("")

    # 기본 타입 - 복사 의미론
    print("--- 정수값 복사 ---")
    let x = 5
    let y = x
    print("x = " + str(x))
    print("y = " + str(y))
    print("y를 변경한다면... (변수 불가능하므로 생략)")
    print("")

    # 가변 변수로 복사 테스트
    print("--- 가변 정수값 복사 ---")
    var a = 10
    var b = a
    print("a = " + str(a))
    print("b = " + str(b))
    b = 20
    print("b를 20으로 변경 후:")
    print("a = " + str(a) + " (변경되지 않음)")
    print("b = " + str(b))
    print("")

    # 배열의 값 의미론
    print("--- 배열 복사 ---")
    var arr1 = [1, 2, 3]
    var arr2 = arr1
    print("arr1 = [1, 2, 3]")
    print("arr2 = arr1 (복사)")
    arr2[0] = 100
    print("arr2[0]을 100으로 변경 후:")
    print("arr1[0] = " + str(arr1[0]) + " (원본 유지)")
    print("arr2[0] = " + str(arr2[0]))
    print("")

    # 문자열의 값 의미론
    print("--- 문자열 복사 ---")
    let str1 = "Hello"
    let str2 = str1
    print("str1 = " + str1)
    print("str2 = " + str2)
    print("같은 내용이지만 다른 메모리 위치 (복사)")
    print("")

    # 값 의미론의 장점
    print("=== 값 의미론의 특징 ===")
    print("✓ 예측 가능한 동작")
    print("✓ 스레드 안전성")
    print("✓ 참조 추적 불필요")
    print("✓ 성능 최적화 용이")
