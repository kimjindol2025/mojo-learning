# 행렬 연산 및 성능 최적화

fn matrix_multiply_naive(a: List, b: List, m: Int, n: Int, p: Int) -> List:
    """
    행렬 곱셈 (순진한 구현)
    A: m×n, B: n×p → C: m×p
    """
    var c = []
    for i in range(m):
        for j in range(p):
            var sum_val = 0
            for k in range(n):
                sum_val += a[i * n + k] * b[k * p + j]
            c.append(sum_val)
    return c

fn matrix_vector_multiply(matrix: List, vector: List, bias: List, dim_m: Int, dim_n: Int) -> List:
    """
    행렬-벡터 곱셈: y = Mx + b
    """
    var result = []
    for i in range(dim_m):
        var sum_val = 0
        for j in range(dim_n):
            sum_val += matrix[i * dim_n + j] * vector[j]
        result.append(sum_val + bias[i])
    return result

fn element_wise_multiply(a: List, b: List) -> List:
    """요소별 곱셈"""
    var result = []
    for i in range(len(a)):
        result.append(a[i] * b[i])
    return result

fn element_wise_add(a: List, b: List) -> List:
    """요소별 덧셈"""
    var result = []
    for i in range(len(a)):
        result.append(a[i] + b[i])
    return result

fn matrix_scale(matrix: List, scalar: Float64) -> List:
    """스칼라배"""
    var result = []
    for val in matrix:
        result.append(val * scalar)
    return result

fn matrix_sum(matrix: List) -> Float64:
    """합계"""
    var total = 0
    for val in matrix:
        total += val
    return total

fn frobenius_norm(matrix: List) -> Float64:
    """프로베니우스 노름"""
    var sum_sq = 0
    for val in matrix:
        sum_sq += val * val
    return sum_sq ** 0.5

fn main():
    print("행렬 연산 및 성능 최적화")
    print("")

    # 1. 행렬 곱셈
    print("3x3 행렬 곱셈")
    let a_3x3 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let b_3x3 = [1, 0, 0, 0, 1, 0, 0, 0, 1]
    let c_3x3 = matrix_multiply_naive(a_3x3, b_3x3, 3, 3, 3)
    print("결과:")
    for i in range(3):
        print("  행렬")
    print("")

    # 2. 행렬-벡터 곱셈
    print("행렬-벡터 곱셈")
    let weight_matrix = [1, 2, 3, 4, 5, 6]
    let input_vec = [1, 2]
    let bias_vec = [0.1, 0.2, 0.3]
    let output = matrix_vector_multiply(weight_matrix, input_vec, bias_vec, 3, 2)
    print("출력 계산됨")
    print("")

    # 3. 요소별 연산
    print("요소별 연산")
    let v1 = [1, 2, 3, 4]
    let v2 = [2, 3, 4, 5]
    let elem_mult = element_wise_multiply(v1, v2)
    print("곱셈 완료")
    let elem_sum = element_wise_add(v1, v2)
    print("덧셈 완료")
    print("")

    # 4. 스칼라배
    print("스칼라배")
    let gradient = [0.1, 0.2, 0.3]
    let learning_rate = 0.01
    let update = matrix_scale(gradient, learning_rate)
    print("업데이트 완료")
    print("")

    # 5. 행렬 노름
    print("Frobenius 노름")
    let test_matrix = [1, 2, 3, 4]
    let norm = frobenius_norm(test_matrix)
    print("노름 계산됨")
    print("")

    # 6. 성능 분석
    print("성능 분석")
    print("행렬 크기별 시간복잡도")
    print("100x100: 1000000 연산")
    print("1000x1000: 1000000000 연산")
    print("")
