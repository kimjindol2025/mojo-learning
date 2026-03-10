fn main():
    # 정수형 타입
    print("=== 정수형 (Integer Types) ===")
    let int_64: Int = 9223372036854775807  # 64비트
    let int_32: Int32 = 2147483647  # 32비트
    let int_16: Int16 = 32767  # 16비트
    let int_8: Int8 = 127  # 8비트

    print("Int (64비트) = " + str(int_64))
    print("Int32 = " + str(int_32))
    print("Int16 = " + str(int_16))
    print("Int8 = " + str(int_8))
    print("")

    # 부동소수점 타입
    print("=== 부동소수점 (Float Types) ===")
    let float_64: Float64 = 3.141592653589793
    let float_32: Float32 = 3.14  # 32비트 정밀도

    print("Float64 = " + str(float_64))
    print("Float32 = " + str(float_32))
    print("")

    # 불린 타입
    print("=== 불린 (Boolean) ===")
    let is_true: Bool = true
    let is_false: Bool = false

    print("true = " + str(is_true))
    print("false = " + str(is_false))
    print("")

    # 문자열 타입
    print("=== 문자열 (String) ===")
    let greeting: String = "Hello, Mojo!"
    let multiline = "Python Syntax\nC++ Performance"

    print("greeting = " + greeting)
    print("multiline:")
    print(multiline)
    print("")

    # 문자 타입
    print("=== 문자 (Character) ===")
    let char_a: String = "A"  # Mojo에서는 문자를 String으로 처리
    let char_m: String = "M"

    print("char_a = " + char_a)
    print("char_m = " + char_m)
    print("")

    # 타입 변환
    print("=== 타입 변환 (Type Casting) ===")
    let number = 42
    let number_str = str(number)

    print("Int to String: " + number_str)
    print("")

    # 수학 연산
    print("=== 기본 연산 ===")
    let a: Int = 10
    let b: Int = 3

    print("덧셈: " + str(a + b))
    print("뺄셈: " + str(a - b))
    print("곱셈: " + str(a * b))
    print("나눗셈: " + str(a / b))
    print("나머지: " + str(a % b))
