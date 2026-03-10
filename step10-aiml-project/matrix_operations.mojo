fn matrix_add(a: List, b: List) -> List:
    var result = []
    for i in range(len(a)):
        result.append(a[i] + b[i])
    return result

fn matrix_scale(a: List, scalar: Int) -> List:
    var result = []
    for item in a:
        result.append(item * scalar)
    return result

fn dot_product(a: List, b: List) -> Int:
    var sum_val = 0
    for i in range(len(a)):
        sum_val += a[i] * b[i]
    return sum_val

fn matrix_transpose(matrix: List, rows: Int, cols: Int) -> List:
    var result = []
    for j in range(cols):
        for i in range(rows):
            result.append(matrix[i * cols + j])
    return result

fn main():
    print("=== 행렬 연산 (Matrix Operations) ===")
    print("")

    # 1. 행렬 덧셈
    print("--- 행렬 덧셈 ---")
    let A = [1, 2, 3, 4]  # 2×2
    let B = [5, 6, 7, 8]  # 2×2

    let C = matrix_add(A, B)
    print("A = [1, 2, 3, 4]  (2×2)")
    print("B = [5, 6, 7, 8]  (2×2)")
    print("A + B = [6, 8, 10, 12]")
    print("")

    # 2. 행렬 스칼라곱
    print("--- 행렬 스칼라곱 ---")
    let matrix = [1, 2, 3, 4]
    let scalar = 3

    let scaled = matrix_scale(matrix, scalar)
    print("M = [1, 2, 3, 4]")
    print("M × 3 = [3, 6, 9, 12]")
    print("")

    # 3. 벡터 내적
    print("--- 벡터 내적 (Dot Product) ---")
    let v1 = [1, 2, 3]
    let v2 = [4, 5, 6]

    let dot = dot_product(v1, v2)
    print("v1 = [1, 2, 3]")
    print("v2 = [4, 5, 6]")
    print("v1 · v2 = 1×4 + 2×5 + 3×6 = " + str(dot))
    print("")

    # 4. 행렬 전치
    print("--- 행렬 전치 ---")
    let M = [1, 2, 3, 4, 5, 6]  # 2×3
    print("원본 M (2×3):")
    print("  [1, 2, 3]")
    print("  [4, 5, 6]")

    let M_T = matrix_transpose(M, 2, 3)
    print("전치 M^T (3×2):")
    print("  [1, 4]")
    print("  [2, 5]")
    print("  [3, 6]")
    print("")

    # 5. 행렬 곱셈 (2×2 × 2×2)
    print("--- 행렬 곱셈 ---")
    let mat1 = [1, 2, 3, 4]  # 2×2
    let mat2 = [5, 6, 7, 8]  # 2×2

    print("A = [[1, 2],")
    print("     [3, 4]]")
    print("")
    print("B = [[5, 6],")
    print("     [7, 8]]")
    print("")

    let prod11 = 1 * 5 + 2 * 7
    let prod12 = 1 * 6 + 2 * 8
    let prod21 = 3 * 5 + 4 * 7
    let prod22 = 3 * 6 + 4 * 8

    print("A × B = [[" + str(prod11) + ", " + str(prod12) + "],")
    print("         [" + str(prod21) + ", " + str(prod22) + "]]")
    print("")

    # 6. 배치 연산
    print("--- 배치 연산 (Batch Matrix) ---")
    print("32개 샘플의 배치")
    print("입력 크기: 784 (28×28 이미지)")
    print("출력 크기: 10 (클래스)")
    print("연산: [32, 784] × [784, 10] = [32, 10]")
    print("")

    # 7. 행렬 연산의 복잡도
    print("=== 시간 복잡도 ===")
    print("덧셈: O(n×m)")
    print("곱셈: O(n×m×p)")
    print("전치: O(n×m)")
    print("더 많은 데이터 = 더 많은 계산")
