fn main():
    # let - 불변 (재할당 불가)
    let x = 5
    let y: Int = 10
    let name = "Mojo"

    print("불변 변수:")
    print("x = " + str(x))
    print("y = " + str(y))
    print("name = " + name)
    print("")

    # var - 가변 (재할당 가능)
    var count = 0
    count = 1
    count += 5

    print("가변 변수:")
    print("count (초기값) = 0")
    print("count (할당 후) = 1")
    print("count (증감 후) = " + str(count))
    print("")

    # 타입 추론
    let auto_int = 42  # Int로 추론
    let auto_float = 3.14  # Float로 추론
    let auto_str = "hello"  # String으로 추론

    print("타입 추론:")
    print("auto_int = " + str(auto_int) + " (Int)")
    print("auto_float = " + str(auto_float) + " (Float)")
    print("auto_str = " + auto_str + " (String)")
    print("")

    # 명시적 타입 지정
    let explicit_int: Int = 100
    let explicit_float: Float64 = 2.71828
    let explicit_bool: Bool = true

    print("명시적 타입:")
    print("explicit_int = " + str(explicit_int))
    print("explicit_float = " + str(explicit_float))
    print("explicit_bool = " + str(explicit_bool))
