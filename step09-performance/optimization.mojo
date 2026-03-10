fn matrix_multiply(a: List, b: List) -> List:
    let size = 3  # 3x3 행렬
    var result = []

    for i in range(size):
        for j in range(size):
            var sum_val = 0
            for k in range(size):
                sum_val += a[i * size + k] * b[k * size + j]
            result.append(sum_val)

    return result

fn vector_sum(v: List) -> Int:
    var total = 0
    for item in v:
        total += item
    return total

fn array_scaling(arr: List, scalar: Int) -> List:
    var result = []
    for item in arr:
        result.append(item * scalar)
    return result

fn main():
    print("=== 성능 최적화 ===")
    print("")

    # 1. 벡터 합 - O(n)
    print("--- 벡터 합 최적화 ---")
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let sum_result = vector_sum(numbers)
    print("합계: " + str(sum_result))
    print("시간복잡도: O(n)")
    print("")

    # 2. 배열 스케일링 - O(n)
    print("--- 배열 스케일링 (SIMD 최적화 기회) ---")
    let data = [1, 2, 3, 4, 5]
    let scaled = array_scaling(data, 2)
    print("스케일 × 2:")
    for i in range(len(scaled)):
        print("  " + str(scaled[i]))
    print("")

    # 3. 행렬 곱셈 - O(n³)
    print("--- 행렬 곱셈 최적화 ---")
    print("3×3 행렬 곱셈")
    print("시간복잡도: O(n³)")
    print("메모리 접근 패턴: 캐시 친화적 필요")
    print("")

    # 4. 메모리 캐시 최적화
    print("--- 캐시 최적화 ---")
    let matrix_data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    var cache_sum = 0
    for row in matrix_data:
        for item in row:
            cache_sum += item
    print("행렬 합: " + str(cache_sum))
    print("접근 패턴: 행-주요 순서 (캐시 효율적)")
    print("")

    # 5. 병렬 처리
    print("--- 병렬 처리 ---")
    let large_data = [1, 2, 3, 4, 5, 6, 7, 8]
    let processed = array_scaling(large_data, 3)
    print("병렬 처리 가능한 연산:")
    print("  각 요소가 독립적")
    print("  SIMD로 여러 요소 동시 처리")
    print("")

    # 6. 알고리즘 선택
    print("=== 최적화 전략 ===")
    print("✓ SIMD 벡터화 (AI/ML)")
    print("✓ 캐시 지역성 (메모리 접근)")
    print("✓ 병렬화 (다중 코어)")
    print("✓ 알고리즘 선택 (시간복잡도)")
    print("✓ 컴파일 최적화 (-O2, -O3)")
