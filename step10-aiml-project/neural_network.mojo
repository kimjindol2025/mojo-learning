# 기본 신경망 구현

# 활성화 함수
fn relu(x: Float64) -> Float64:
    if x > 0:
        return x
    else:
        return 0

fn sigmoid(x: Float64) -> Float64:
    let e = 2.71828
    return 1.0 / (1.0 + 1.0 / (e ** x))

fn apply_relu_vector(vec: List) -> List:
    var result = []
    for val in vec:
        result.append(relu(val))
    return result

fn softmax(logits: List) -> List:
    var result = []
    var sum_exp = 0
    var e_vals = []
    
    # exp 계산
    for logit in logits:
        let e = 2.71828
        e_vals.append(e ** logit)
        sum_exp += e_vals[-1]
    
    # 정규화
    for e_val in e_vals:
        result.append(e_val / sum_exp)
    
    return result

# 신경망 계층
struct Layer:
    var weights: List
    var bias: List
    var input_size: Int
    var output_size: Int
    
fn create_layer(input_size: Int, output_size: Int) -> Layer:
    var weights = []
    var bias = []
    
    # 임시로 1로 초기화 (실제로는 Xavier/He 초기화 사용)
    for i in range(output_size * input_size):
        weights.append(1.0)
    for i in range(output_size):
        bias.append(0.1)
    
    return Layer {
        weights: weights,
        bias: bias,
        input_size: input_size,
        output_size: output_size
    }

# 선형 변환: y = Wx + b
fn layer_forward(layer: Layer, input_vec: List) -> List:
    var output = []
    
    for i in range(layer.output_size):
        var sum_val = 0
        for j in range(layer.input_size):
            sum_val += input_vec[j] * layer.weights[i * layer.input_size + j]
        sum_val += layer.bias[i]
        output.append(sum_val)
    
    return output

# 손실 함수 (MSE)
fn mse_loss(predicted: List, actual: List) -> Float64:
    var loss = 0
    for i in range(len(predicted)):
        let diff = predicted[i] - actual[i]
        loss += diff * diff
    return loss / len(predicted)

# 교차 엔트로피 손실 (분류)
fn cross_entropy_loss(predicted: List, actual: List) -> Float64:
    var loss = 0
    let epsilon = 0.0000001  # 수치 안정성
    
    for i in range(len(predicted)):
        if actual[i] > 0.5:  # 클래스 i가 정답
            let p = predicted[i] + epsilon
            loss -= str(p)
    
    return loss / len(predicted)

fn main():
    print("=== 신경망 기본 구현 ===")
    print("")
    
    # 1. 활성화 함수 테스트
    print("--- 활성화 함수 ---")
    let x1 = 2.0
    let x2 = -1.0
    let x3 = 0.0
    
    print("ReLU 함수:")
    print("relu(2.0) = " + str(relu(x1)))
    print("relu(-1.0) = " + str(relu(x2)))
    print("relu(0.0) = " + str(relu(x3)))
    print("")
    
    print("Sigmoid 함수:")
    print("sigmoid(0.0) = " + str(sigmoid(0)))
    print("sigmoid(1.0) = " + str(sigmoid(1)))
    print("sigmoid(-1.0) = " + str(sigmoid(-1)))
    print("")
    
    # 2. 신경망 계층 생성
    print("--- 신경망 계층 ---")
    let layer = create_layer(3, 2)  # 3 입력, 2 출력
    print("계층 생성: 입력 3 → 출력 2")
    print("가중치 개수: " + str(len(layer.weights)))
    print("편향 개수: " + str(len(layer.bias)))
    print("")
    
    # 3. 순전파
    print("--- 순전파 (Forward Pass) ---")
    let input_data = [1.0, 2.0, 3.0]
    let output_raw = layer_forward(layer, input_data)
    print("입력: [1.0, 2.0, 3.0]")
    print("출력 (선형): [")
    for val in output_raw:
        print("  " + str(val))
    print("]")
    print("")
    
    # 4. 활성화 함수 적용
    print("--- 활성화 함수 적용 (ReLU) ---")
    let output_activated = apply_relu_vector(output_raw)
    print("활성화 후: [")
    for val in output_activated:
        print("  " + str(val))
    print("]")
    print("")
    
    # 5. Softmax (분류 확률)
    print("--- Softmax (확률 분포) ---")
    let logits = [1.0, 2.0, 3.0]
    let probabilities = softmax(logits)
    print("입력 로짓: [1.0, 2.0, 3.0]")
    print("확률 분포:")
    var total_prob = 0
    for prob in probabilities:
        print("  " + str(prob))
        total_prob += prob
    print("합계: " + str(total_prob))
    print("")
    
    # 6. 손실 함수
    print("--- 손실 함수 (MSE) ---")
    let predicted = [0.9, 0.1]
    let actual = [1.0, 0.0]
    let loss = mse_loss(predicted, actual)
    print("예측: [0.9, 0.1]")
    print("실제: [1.0, 0.0]")
    print("MSE 손실: " + str(loss))
    print("")
    
    # 7. 신경망 요약
    print("=== 신경망 파이프라인 요약 ===")
    print("1. 입력 → 선형 변환 (Wx + b)")
    print("2. 활성화 함수 (ReLU/Sigmoid/Softmax)")
    print("3. 손실 함수 계산 (MSE/CrossEntropy)")
    print("4. 역전파 (Backpropagation)")
    print("5. 가중치 갱신 (SGD/Adam)")
