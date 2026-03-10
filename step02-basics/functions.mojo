# fn - 정적 타입 (컴파일 타임 최적화, 권장)
fn add_int(a: Int, b: Int) -> Int:
    return a + b

fn greet(name: String) -> String:
    return "Hello, " + name + "!"

fn multiply_float(x: Float64, y: Float64) -> Float64:
    return x * y

# def - 동적 타입 (Python 호환, 유연성)
def dynamic_multiply(x, y):
    return x * y

def dynamic_concat(a, b):
    return str(a) + str(b)

# 함수 오버로딩 - 같은 이름, 다른 타입
fn process(x: Int) -> String:
    return "정수 처리: " + str(x * 2)

fn process(x: Float64) -> String:
    return "실수 처리: " + str(x * 2.0)

fn process(x: String) -> String:
    return "문자열 처리: " + x + x

# 기본값이 있는 함수
fn greet_with_suffix(name: String, suffix: String = "!") -> String:
    return "Hello, " + name + suffix

# 여러 반환값 (튜플)
fn divmod_custom(a: Int, b: Int) -> String:
    let quotient = a / b
    let remainder = a % b
    return str(quotient) + " (몫), " + str(remainder) + " (나머지)"

# 재귀 함수
fn factorial(n: Int) -> Int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# 고차 함수 - 함수를 인자로 받기
fn apply_operation(a: Int, b: Int, operation: String) -> Int:
    if operation == "add":
        return a + b
    elif operation == "sub":
        return a - b
    elif operation == "mul":
        return a * b
    else:
        return 0

fn main():
    print("=== fn 정적 타입 함수 ===")
    let result1 = add_int(5, 3)
    print("add_int(5, 3) = " + str(result1))

    let greeting = greet("Mojo")
    print("greet(\"Mojo\") = " + greeting)

    let float_result = multiply_float(3.5, 2.5)
    print("multiply_float(3.5, 2.5) = " + str(float_result))
    print("")

    print("=== def 동적 타입 함수 ===")
    let dyn_mul = dynamic_multiply(4, 5)
    print("dynamic_multiply(4, 5) = " + str(dyn_mul))

    let dyn_concat = dynamic_concat("Hello", 123)
    print("dynamic_concat(\"Hello\", 123) = " + dyn_concat)
    print("")

    print("=== 함수 오버로딩 ===")
    let process_int = process(10)
    print(process_int)

    let process_float = process(2.5)
    print(process_float)

    let process_str = process("hi")
    print(process_str)
    print("")

    print("=== 기본값 매개변수 ===")
    let greet1 = greet_with_suffix("World")
    print(greet1)

    let greet2 = greet_with_suffix("World", "!!!")
    print(greet2)
    print("")

    print("=== divmod ===")
    let dm = divmod_custom(17, 5)
    print("17 ÷ 5 = " + dm)
    print("")

    print("=== 재귀 함수 ===")
    let fact5 = factorial(5)
    print("factorial(5) = " + str(fact5))

    let fact3 = factorial(3)
    print("factorial(3) = " + str(fact3))
    print("")

    print("=== 고차 함수 (조건부 연산) ===")
    let add_result = apply_operation(10, 5, "add")
    print("10 + 5 = " + str(add_result))

    let sub_result = apply_operation(10, 5, "sub")
    print("10 - 5 = " + str(sub_result))

    let mul_result = apply_operation(10, 5, "mul")
    print("10 * 5 = " + str(mul_result))
    print("")

    print("=== 문자열 보간 ===")
    let name = "Mojo"
    let version = 7
    let message = "Language: " + name + ", Version: " + str(version)
    print(message)

    let x = 42
    let y = 8
    let math_msg = "x=" + str(x) + ", y=" + str(y) + ", x+y=" + str(x + y)
    print(math_msg)
