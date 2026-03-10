# Mojo 컴파일러 심화 분석

## 📌 개요

이 폴더는 Mojo의 내부 구조, 컴파일 과정, 최적화 기법을 심화 분석합니다.

## 📚 문서 목록

### 1. mojo_ast.md
- **주제:** Abstract Syntax Tree (AST) 분석
- **내용:**
  - Mojo AST 구조
  - Python vs Mojo AST 차이
  - 타입 추론 알고리즘
  - 코드 생성 과정

### 2. llvm_integration.md
- **주제:** LLVM 백엔드 통합
- **내용:**
  - Mojo → LLVM IR 변환
  - 최적화 패스 (O0, O1, O2, O3)
  - 성능 프로파일링
  - AOT vs JIT 컴파일

### 3. python_interop.md
- **주제:** Python 상호 운용성
- **내용:**
  - Python 모듈 import
  - GIL (Global Interpreter Lock) 대응
  - NumPy 배열 통합
  - CPython 확장 호출

---

## 🔬 분석 방법론

1. **코드 파싱**
   ```bash
   mojo compile --emit-llvm hello.mojo
   ```

2. **성능 측정**
   ```bash
   mojo build --stats hello.mojo
   ```

3. **디버그 정보**
   ```bash
   mojo run -g hello.mojo
   ```

---

## 🎯 학습 흐름

```
Step 1-2 (기본)
    ↓
Step 3-4 (타입과 메모리)
    ↓
Step 5-6 (소유권과 함수)
    ↓
Step 7-8 (구조체와 Trait)
    ↓
Step 9 (성능 최적화)
    ↓
compiler-analysis (심화)
```

---

**작성자:** Claude Haiku 4.5
**마지막 업데이트:** 2026-03-10
