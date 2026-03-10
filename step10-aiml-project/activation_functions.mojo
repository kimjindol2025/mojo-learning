# 활성화 함수 상세 분석

# 1. ReLU (Rectified Linear Unit)
fn relu(x: Float64) -> Float64:
    if x > 0:
        return x
    else:
        return 0

fn relu_derivative(x: Float64) -> Float64:
    if x > 0:
        return 1
    else:
        return 0

# 2. LeakyReLU (음수에 작은 기울기 허용)
fn leaky_relu(x: Float64, alpha: Float64 = 0.01) -> Float64:
    if x > 0:
        return x
    else:
        return alpha * x

# 3. Sigmoid (0 ~ 1 범위)
fn sigmoid(x: Float64) -> Float64:
    let e = 2.71828
    return 1.0 / (1.0 + 1.0 / (e ** x))

fn sigmoid_derivative(x: Float64) -> Float64:
    let s = sigmoid(x)
    return s * (1.0 - s)

# 4. Tanh (쌍곡 탄젠트, -1 ~ 1 범위)
fn tanh(x: Float64) -> Float64:
    let e = 2.71828
    let exp_2x = e ** (2.0 * x)
    return (exp_2x - 1.0) / (exp_2x + 1.0)

fn tanh_derivative(x: Float64) -> Float64:
    let t = tanh(x)
    return 1.0 - (t * t)

# 5. Softmax (확률 분포)
fn softmax(logits: List) -> List:
    var result = []
    var sum_exp = 0
    var e_vals = []
    
    let e = 2.71828
    for logit in logits:
        let e_val = e ** logit
        e_vals.append(e_val)
        sum_exp += e_val
    
    for e_val in e_vals:
        result.append(e_val / sum_exp)
    
    return result

# 6. ELU (Exponential Linear Unit)
fn elu(x: Float64, alpha: Float64 = 1.0) -> Float64:
    if x > 0:
        return x
    else:
        let e = 2.71828
        return alpha * (e ** x - 1)

# 7. GELU (Gaussian Error Linear Unit) - 근사
fn gelu_approx(x: Float64) -> Float64:
    let cdf = 0.5 * (1.0 + tanh(x))  # 근사
    return x * cdf

# 벡터 버전
fn apply_activation(vec: List, activation_type: String) -> List:
    var result = []
    
    if activation_type == "relu":
        for val in vec:
            result.append(relu(val))
    elif activation_type == "sigmoid":
        for val in vec:
            result.append(sigmoid(val))
    elif activation_type == "tanh":
        for val in vec:
            result.append(tanh(val))
    elif activation_type == "leaky_relu":
        for val in vec:
            result.append(leaky_relu(val, 0.01))
    elif activation_type == "softmax":
        result = softmax(vec)
    
    return result

fn main():
    print("=== 활성화 함수 분석 ===")
    print("")
    
    # 테스트 데이터
    let test_values = [-3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0]
    
    # 1. ReLU 비교
    print("--- 1. ReLU (Rectified Linear Unit) ---")
    print("공식: f(x) = max(0, x)")
    print("")
    print("x값\t| ReLU(x)\t| 미분값")
    print("-----\t|----------\t|-------")
    for x in test_values:
        let relu_val = relu(x)
        let deriv = relu_derivative(x)
        print(str(x) + "\t| " + str(relu_val) + "\t\t| " + str(deriv))
    print("")
    print("특징: 간단하고 빠르지만, dying ReLU 문제 있음")
    print("")
    
    # 2. LeakyReLU 비교
    print("--- 2. LeakyReLU (α=0.01) ---")
    print("공식: f(x) = x if x > 0 else α*x")
    print("")
    print("x값\t| LeakyReLU(x)")
    print("-----\t|----------")
    for x in test_values:
        let lr_val = leaky_relu(x, 0.01)
        print(str(x) + "\t| " + str(lr_val))
    print("")
    print("특징: dying ReLU 문제 해결")
    print("")
    
    # 3. Sigmoid 비교
    print("--- 3. Sigmoid (로지스틱 함수) ---")
    print("공식: f(x) = 1 / (1 + e^-x)")
    print("범위: (0, 1)")
    print("")
    print("x값\t| Sigmoid(x)\t| 미분값")
    print("-----\t|----------\t|-------")
    for x in test_values:
        let sig_val = sigmoid(x)
        let deriv = sigmoid_derivative(x)
        print(str(x) + "\t| " + str(sig_val) + "\t| " + str(deriv))
    print("")
    print("특징: 이진 분류에 사용, 미분값이 max=0.25")
    print("")
    
    # 4. Tanh 비교
    print("--- 4. Tanh (쌍곡 탄젠트) ---")
    print("공식: f(x) = (e^2x - 1) / (e^2x + 1)")
    print("범위: (-1, 1)")
    print("")
    print("x값\t| Tanh(x)\t| 미분값")
    print("-----\t|----------\t|-------")
    for x in test_values:
        let tanh_val = tanh(x)
        let deriv = tanh_derivative(x)
        print(str(x) + "\t| " + str(tanh_val) + "\t| " + str(deriv))
    print("")
    print("특징: Sigmoid보다 대칭적, 중심이 0")
    print("")
    
    # 5. Softmax 비교 (다중 클래스)
    print("--- 5. Softmax (확률 정규화) ---")
    print("공식: f(x_i) = e^x_i / Σ(e^x_j)")
    print("범위: (0, 1), 합=1")
    print("")
    let logits = [1.0, 2.0, 3.0]
    let probs = softmax(logits)
    print("입력 로짓: [1.0, 2.0, 3.0]")
    print("Softmax 출력 (확률):")
    var total = 0
    for i in range(len(probs)):
        print("  클래스 " + str(i) + ": " + str(probs[i]))
        total += probs[i]
    print("합계: " + str(total))
    print("")
    print("특징: 다중 클래스 분류에 사용")
    print("")
    
    # 6. ELU 비교
    print("--- 6. ELU (Exponential Linear Unit) ---")
    print("공식: f(x) = x if x > 0 else α(e^x - 1)")
    print("")
    print("x값\t| ELU(x)")
    print("-----\t|----------")
    for x in test_values:
        let elu_val = elu(x, 1.0)
        print(str(x) + "\t| " + str(elu_val))
    print("")
    print("특징: 음수에서도 그래디언트 존재")
    print("")
    
    # 7. 활성화 함수 비교 표
    print("=== 활성화 함수 비교 ===")
    print("")
    print("함수\t\t| 범위\t\t| 미분 특성\t| 사용처")
    print("--------\t|--------\t|--------\t|--------")
    print("ReLU\t\t| [0, ∞)\t| 빠름\t\t| 은닉층")
    print("Sigmoid\t\t| (0, 1)\t| 느림\t\t| 이진 분류")
    print("Tanh\t\t| (-1, 1)\t| 중간\t\t| 은닉층")
    print("Softmax\t\t| (0, 1)\t| 확률\t\t| 다중 분류")
    print("LeakyReLU\t| (-∞, ∞)\t| 빠름\t\t| 은닉층")
    print("ELU\t\t| (-α, ∞)\t| 중간\t\t| 고급 신경망")
    print("")
    
    # 8. 성능 분석
    print("=== 성능 분석 (1000x1000 활성화) ===")
    print("")
    print("ReLU:      가장 빠름 (1.0x)")
    print("Sigmoid:   느림 (3-5x 느림, exp 계산)")
    print("Tanh:      느림 (3-5x 느림, exp 계산)")
    print("Softmax:   매우 느림 (특히 큰 입력)")
    print("LeakyReLU: 매우 빠름 (ReLU와 동일)")
