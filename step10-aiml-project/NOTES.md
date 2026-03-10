# Step 10: AI/ML 프로젝트 최종

> 목표: Mojo로 신경망을 구현하고 성능을 최적화해 본다

---

## 📋 학습 내용

1. 신경망 아키텍처 설계
2. 행렬 연산 (Matrix Multiplication)
3. 활성화 함수 (ReLU, Sigmoid, Softmax)
4. 순전파 (Forward Propagation)
5. 역전파 (Backpropagation) — 개념
6. 최적화 (Gradient Descent)
7. SIMD 벡터화로 성능 극대화

---

## 신경망 구조

```
입력 계층 (Input Layer)
  ↓
은닉 계층 (Hidden Layer) — 가중치, 편향
  ↓
활성화 함수 (Activation)
  ↓
출력 계층 (Output Layer)
```

---

## 행렬 연산

행렬 곱셈 (Matrix Multiplication):
```
A (m×n) × B (n×p) = C (m×p)
C[i][j] = Σ(A[i][k] × B[k][j])
```

---

## 활성화 함수

1. **ReLU**: max(0, x) — 음수는 0
2. **Sigmoid**: 1 / (1 + e^-x) — 0~1 범위
3. **Softmax**: 확률 분포 — 다중 클래스 분류

---

## 성능 최적화 전략

| 기법 | 효과 |
|------|------|
| SIMD 벡터화 | ~4-8x |
| 캐시 최적화 | ~2x |
| 블록 곱셈 | ~2x |
| GPU 병렬화 | ~50-100x |

---

## Mojo vs Python 성능

```
작업: 1000×1000 행렬 곱셈

Python (NumPy)   : ~100ms
Mojo (fn)        : ~10ms (10x 더 빠름)
Mojo (SIMD)      : ~1ms  (100x 더 빠름)
```

**작성일:** 2026-03-11
