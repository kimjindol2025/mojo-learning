fn relu(x: Int) -> Int:
    if x > 0:
        return x
    else:
        return 0

fn sigmoid_approx(x: Int) -> Int:
    if x > 0:
        return 1
    else:
        return 0

fn matrix_multiply_2x3_3x1(a: List, b: List) -> List:
    var result = []

    # 첫 번째 행: [a[0], a[1], a[2]] · [b[0], b[1], b[2]]
    let sum1 = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    result.append(sum1)

    # 두 번째 행: [a[3], a[4], a[5]] · [b[0], b[1], b[2]]
    let sum2 = a[3] * b[0] + a[4] * b[1] + a[5] * b[2]
    result.append(sum2)

    return result

fn main():
    print("=== AI/ML 프로젝트: 신경망 기초 ===")
    print("")

    # 1. 신경망 구조
    print("--- 신경망 구조 ---")
    print("입력층 (2개 뉴런) → 은닉층 (3개 뉴런) → 출력층 (2개 뉴런)")
    print("총 파라미터: 2×3 + 3×2 = 12개")
    print("")

    # 2. 입력 데이터
    print("--- 입력 데이터 ---")
    let inputs = [2, 3]  # 2개의 입력 특성
    print("input = [2, 3]")
    print("")

    # 3. 가중치 (2×3 행렬)
    print("--- 입력층 → 은닉층 가중치 ---")
    let weights_hidden = [1, 2, 3,    # 첫 번째 뉴런의 가중치
                          4, 5, 6]    # 두 번째 뉴런의 가중치
    print("W1 = [[1, 2, 3],")
    print("      [4, 5, 6]]")
    print("")

    # 4. 편향
    print("--- 편향 ---")
    let bias_hidden = [0, 0, 0]
    print("b1 = [0, 0, 0]")
    print("")

    # 5. 순전파 - 은닉층
    print("--- 순전파: 입력층 → 은닉층 ---")
    var z_hidden = []
    z_hidden.append(inputs[0] * 1 + inputs[1] * 2 + 3)  # 2×1 + 3×2 + 3 = 11
    z_hidden.append(inputs[0] * 4 + inputs[1] * 5 + 6)  # 2×4 + 3×5 + 6 = 29

    print("z_hidden = [" + str(z_hidden[0]) + ", " + str(z_hidden[1]) + "]")

    # 활성화 함수 (ReLU)
    var a_hidden = []
    for z in z_hidden:
        a_hidden.append(relu(z))

    print("a_hidden = [" + str(a_hidden[0]) + ", " + str(a_hidden[1]) + "]")
    print("")

    # 6. 출력층 가중치
    print("--- 은닉층 → 출력층 가중치 ---")
    let weights_output = [2, 3,  # 첫 번째 출력 뉴런
                          1, 4]  # 두 번째 출력 뉴런
    print("W2 = [[2, 3],")
    print("      [1, 4]]")
    print("")

    # 7. 순전파 - 출력층
    print("--- 순전파: 은닉층 → 출력층 ---")
    var z_output = []
    z_output.append(a_hidden[0] * 2 + a_hidden[1] * 3)
    z_output.append(a_hidden[0] * 1 + a_hidden[1] * 4)

    print("z_output = [" + str(z_output[0]) + ", " + str(z_output[1]) + "]")

    # 활성화 함수 (Sigmoid 근사)
    var a_output = []
    for z in z_output:
        a_output.append(sigmoid_approx(z))

    print("a_output = [" + str(a_output[0]) + ", " + str(a_output[1]) + "]")
    print("")

    # 8. 손실 함수 (MSE)
    print("--- 손실 함수 (MSE) ---")
    let target = [1, 0]
    var loss = 0
    for i in range(2):
        let diff = a_output[i] - target[i]
        loss = loss + (diff * diff)
    loss = loss / 2

    print("target = [1, 0]")
    print("loss = " + str(loss))
    print("")

    # 9. 신경망 요약
    print("=== 신경망 학습 과정 ===")
    print("1. 순전파: 입력 → 은닉층 → 출력층")
    print("2. 손실 계산: 예측값 vs 실제값")
    print("3. 역전파: 손실 기울기 계산")
    print("4. 가중치 업데이트: 경사 하강법")
    print("5. 반복: 손실이 수렴할 때까지")
    print("")

    # 10. Mojo의 AI/ML 장점
    print("=== Mojo의 AI/ML 장점 ===")
    print("✓ Python 문법 + C++ 성능")
    print("✓ SIMD 벡터화 최적화")
    print("✓ GPU 병렬 처리")
    print("✓ 컴파일 타임 최적화")
    print("✓ 메모리 효율성")
