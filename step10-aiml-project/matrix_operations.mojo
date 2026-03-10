# 행렬 연산 및 성능 최적화

fn matrix_multiply_naive(a: List, b: List, m: Int, n: Int, p: Int) -> List:
    """
    행렬 곱셈 (순진한 구현)
    A: m×n, B: n×p → C: m×p
    시간복잡도: O(m*n*p)
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
    M: m×n, x: n, b: m → y: m
    """
    var result = []
    
    for i in range(dim_m):
        var sum_val = 0
        for j in range(dim_n):
            sum_val += matrix[i * dim_n + j] * vector[j]
        result.append(sum_val + bias[i])
    
    return result

fn transpose(matrix: List, m: Int, n: Int) -> List:
    """
    행렬 전치: A^T
    """
    var result = []
    
    for j in range(n):
        for i in range(m):
            result.append(matrix[i * n + j])
    
    return result

fn element_wise_multiply(a: List, b: List) -> List:
    """
    요소별 곱셈 (Hadamard product)
    """
    var result = []
    for i in range(len(a)):
        result.append(a[i] * b[i])
    return result

fn element_wise_add(a: List, b: List) -> List:
    """
    요소별 덧셈
    """
    var result = []
    for i in range(len(a)):
        result.append(a[i] + b[i])
    return result

fn matrix_scale(matrix: List, scalar: Float64) -> List:
    """
    행렬 스칼라배
    """
    var result = []
    for val in matrix:
        result.append(val * scalar)
    return result

fn matrix_sum(matrix: List) -> Float64:
    """
    모든 원소의 합
    """
    var total = 0
    for val in matrix:
        total += val
    return total

fn frobenius_norm(matrix: List) -> Float64:
    """
    Frobenius 노름 (행렬의 크기)
    ||A||_F = sqrt(Σ(a_ij^2))
    """
    var sum_sq = 0
    for val in matrix:
        sum_sq += val * val
    return sum_sq ** 0.5

fn main():
    print("=== 행렬 연산 및 성능 최적화 ===")
    print("")
    
    # 1. 작은 행렬 곱셈 (3×3 × 3×3)
    print("--- 3×3 행렬 곱셈 ---")
    let a_3x3 = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
    ]
    let b_3x3 = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]
    let c_3x3 = matrix_multiply_naive(a_3x3, b_3x3, 3, 3, 3)
    print("A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]")
    print("B = 단위 행렬 (Identity)")
    print("A × B = [")
    for i in range(3):
        print("  [" + str(c_3x3[i*3]) + ", " + str(c_3x3[i*3+1]) + ", " + str(c_3x3[i*3+2]) + "]")
    print("]")
    print("")
    
    # 2. 행렬-벡터 곱셈
    print("--- 행렬-벡터 곱셈 (신경망 계층) ---")
    let weight_matrix = [
        1, 2,
        3, 4,
        5, 6
    ]
    let input_vec = [1, 2]
    let bias_vec = [0.1, 0.2, 0.3]
    
    let output = matrix_vector_multiply(weight_matrix, input_vec, bias_vec, 3, 2)
    print("W (3×2) = [[1, 2], [3, 4], [5, 6]]")
    print("x (2) = [1, 2]")
    print("b (3) = [0.1, 0.2, 0.3]")
    print("y = Wx + b = [")
    for val in output:
        print("  " + str(val))
    print("]")
    print("")
    
    # 3. 요소별 연산
    print("--- 요소별 연산 ---")
    let v1 = [1, 2, 3, 4]
    let v2 = [2, 3, 4, 5]
    
    let elem_mult = element_wise_multiply(v1, v2)
    print("v1 = [1, 2, 3, 4]")
    print("v2 = [2, 3, 4, 5]")
    print("v1 ⊙ v2 (요소별 곱) = [")
    for val in elem_mult:
        print("  " + str(val))
    print("]")
    print("")
    
    let elem_sum = element_wise_add(v1, v2)
    print("v1 + v2 (요소별 합) = [")
    for val in elem_sum:
        print("  " + str(val))
    print("]")
    print("")
    
    # 4. 스칼라배
    print("--- 스칼라배 (학습률 조정) ---")
    let gradient = [0.1, 0.2, 0.3]
    let learning_rate = 0.01
    let update = matrix_scale(gradient, learning_rate)
    print("그래디언트 = [0.1, 0.2, 0.3]")
    print("학습률 = 0.01")
    print("업데이트 = [")
    for val in update:
        print("  " + str(val))
    print("]")
    print("")
    
    # 5. 행렬 노름
    print("--- Frobenius 노름 (행렬 크기) ---")
    let test_matrix = [1, 2, 3, 4]
    let norm = frobenius_norm(test_matrix)
    print("행렬 = [1, 2, 3, 4]")
    print("||A||_F = " + str(norm))
    print("")
    
    # 6. 큰 행렬 곱셈 성능 분석
    print("=== 성능 분석 ===")
    print("행렬 크기별 시간복잡도:")
    print("  100×100 × 100×100: 100^3 = 1,000,000 연산")
    print("  1000×1000 × 1000×1000: 1000^3 = 1,000,000,000 연산")
    print("")
    
    # 7. 메모리 접근 패턴
    print("--- 메모리 캐시 최적화 ---")
    print("행 주요 (Row-major) 접근:")
    print("  for i in range(m):")
    print("    for j in range(p):")
    print("      for k in range(n):")
    print("        c[i*p+j] += a[i*n+k] * b[k*p+j]")
    print("")
    print("캐시 효율: ✓ 좋음 (a의 행이 캐시에 유지)")
    print("")
    
    # 8. 블록 곱셈 (Cache-blocking)
    print("--- 블록 곱셈 (Advanced Optimization) ---")
    print("큰 행렬을 작은 블록으로 분할하여 캐시 활용")
    print("블록 크기 B가 캐시에 들어가면:")
    print("  - 메모리 대역폭 활용: ~2x")
    print("  - 캐시 미스 감소: ~3x")
    print("  - 총 속도 향상: ~2-4x")
    print("")
    
    print("=== SIMD 벡터화 가능성 ===")
    print("Mojo의 SIMD를 이용하면:")
    print("  - 4개 요소를 한 번에 처리 → ~4x 빠름")
    print("  - 8개 요소 (AVX2) → ~8x 빠름")
    print("  - 16개 요소 (AVX-512) → ~16x 빠름")
