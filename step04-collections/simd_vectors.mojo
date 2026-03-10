fn vector_add(v1: List, v2: List) -> List:
    var result = []
    for i in range(len(v1)):
        result.append(v1[i] + v2[i])
    return result

fn vector_scale(v: List, scalar: Int) -> List:
    var result = []
    for item in v:
        result.append(item * scalar)
    return result

fn vector_dot_product(v1: List, v2: List) -> Int:
    var product = 0
    for i in range(len(v1)):
        product += v1[i] * v2[i]
    return product

fn element_wise_multiply(v1: List, v2: List) -> List:
    var result = []
    for i in range(len(v1)):
        result.append(v1[i] * v2[i])
    return result

fn vector_magnitude(v: List) -> String:
    var sum_sq = 0
    for item in v:
        sum_sq += item * item
    return str(sum_sq)

fn print_vector(label: String, v: List) -> None:
    print(label + " = [" + str(v[0]), end="")
    for i in range(1, len(v)):
        print(", " + str(v[i]), end="")
    print("]")

fn main():
    print("=== SIMD 벡터 연산 ===")
    print("")

    # 1. 벡터 개념
    print("--- 벡터의 개념 ---")
    let v1 = [1, 2, 3, 4]
    let v2 = [5, 6, 7, 8]

    print_vector("벡터1", v1)
    print_vector("벡터2", v2)
    print("")

    # 2. 벡터 덧셈
    print("--- 벡터 덧셈 (Element-wise) ---")
    let v_sum = vector_add(v1, v2)
    print_vector("v1 + v2", v_sum)
    print("(각 요소를 더함)")
    print("")

    # 3. 벡터 스칼라 곱
    print("--- 벡터 스칼라 곱 ---")
    let scaled = vector_scale(v1, 2)
    print_vector("v1 × 2", scaled)
    print("(모든 요소에 스칼라값 곱함)")
    print("")

    # 4. 벡터 내적
    print("--- 벡터 내적 (Dot Product) ---")
    let dot_prod = vector_dot_product(v1, v2)
    print("v1 · v2 = " + str(dot_prod))
    print("계산: 1×5 + 2×6 + 3×7 + 4×8 = " + str(dot_prod))
    print("")

    # 5. 요소별 곱셈
    print("--- 요소별 곱셈 (Element-wise Product) ---")
    let element_prod = element_wise_multiply(v1, v2)
    print_vector("v1 ⊙ v2", element_prod)
    print("(각 요소를 곱함)")
    print("")

    # 6. 벡터 크기 (magnitude)
    print("--- 벡터 크기 계산 ---")
    let mag = vector_magnitude(v1)
    print("||v1|| = √(" + str(v1[0]) + "² + " + str(v1[1]) + "² + " + str(v1[2]) + "² + " + str(v1[3]) + "²)")
    print("||v1||² = " + mag)
    print("")

    # 7. 병렬 처리 시뮬레이션
    print("--- 병렬 처리 (Parallelization) ---")
    let data = [2, 4, 6, 8, 10, 12, 14, 16]
    print("입력 데이터:")
    print_vector("data", data)

    let processed = vector_scale(data, 3)
    print("출력 데이터 (각 요소 × 3):")
    print_vector("result", processed)
    print("(SIMD를 사용하면 한 번에 여러 요소 처리 가능)")
    print("")

    # 8. 행렬-벡터 곱 시뮬레이션
    print("--- 행렬-벡터 곱셈 ---")
    let matrix_row1 = [1, 2, 3]
    let matrix_row2 = [4, 5, 6]
    let vec = [7, 8, 9]

    let result1 = vector_dot_product(matrix_row1, vec)
    let result2 = vector_dot_product(matrix_row2, vec)

    print("행렬 × 벡터 결과:")
    print("  첫 번째 행의 결과: " + str(result1))
    print("  두 번째 행의 결과: " + str(result2))
    print("")

    # 9. SIMD의 성능 이점
    print("=== SIMD의 이점 ===")
    print("✓ 병렬 처리로 성능 향상")
    print("✓ AI/ML 워크로드에 최적")
    print("✓ 메모리 대역폭 효율")
    print("✓ CPU 명령어 활용률 증가")
