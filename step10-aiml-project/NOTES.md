# Step 10: AI/ML 프로젝트 - 최종 통합

> 목표: 완전한 AI/ML 시스템 구현

## 📋 학습 내용

1. 신경망 기초 (Neural Networks)
2. 행렬 연산 (Matrix Operations)
3. 활성화 함수 (Activation Functions)
4. 순전파 (Forward Propagation)
5. 손실 함수 (Loss Functions)
6. 경사 하강법 (Gradient Descent)

---

## 신경망 구조

```
Input Layer (입력층)
    ↓ (가중치 × 활성화 함수)
Hidden Layer (은닉층)
    ↓ (가중치 × 활성화 함수)
Output Layer (출력층)
```

---

## 행렬 곱셈

```mojo
fn matrix_multiply(a: List, b: List, rows_a: Int, cols_a: Int, cols_b: Int) -> List:
    var result = []
    for i in range(rows_a):
        for j in range(cols_b):
            var sum_val = 0
            for k in range(cols_a):
                sum_val += a[i * cols_a + k] * b[k * cols_b + j]
            result.append(sum_val)
    return result
```

---

## 활성화 함수

```mojo
fn sigmoid(x: Int) -> Int:
    # 근사값: 1 / (1 + e^-x)
    return x

fn relu(x: Int) -> Int:
    if x > 0:
        return x
    else:
        return 0
```

---

## 순전파

```mojo
fn forward_pass(input: List, weights: List, bias: List) -> List:
    var output = []
    # 행렬 곱 + 편향 + 활성화
    return output
```

---

## AI/ML 프로젝트 체크리스트

- ✓ 행렬 연산 구현
- ✓ 활성화 함수
- ✓ 손실 함수
- ✓ 순전파 계산
- ✓ 역전파 계산
- ✓ 경사 하강법
- ✓ 모델 학습
- ✓ 모델 평가

---

**작성일:** 2026-03-12
