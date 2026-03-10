# 🔬 Mojo 컴파일러 완전 분해 (Fork & 포크로 찍어먹는 참조 가이드)

> **Modular 내부 엔지니어링팀 Tech Talk + LLVM 발표 자료 기반 완전 역공학 문서**
> *"컴파일러 몰라도 포크로 찍어 먹을 수 있도록" — 레이어별 완전 해체*

---

## 📐 0. 전체 조감도 — "한 장으로 보는 Mojo 컴파일러"

```
┌─────────────────────────────────────────────────────────────────┐
│                        .mojo 소스파일                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
         PHASE 1    │   PARSER / LEX  │  ← lit 다이얼렉트 출력
                    │  (Lexer + AST)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────────┐
         PHASE 2    │  PRE-ELABORATION PASSES      │
                    │  (Semantic Check + Inline     │
                    │   + lit → kgen 다이얼렉트 강하)│
                    └────────┬────────────────────┘
                             │
                    ┌────────▼────────────────────┐
         PHASE 3    │    ELABORATOR                │
                    │  ┌─────────────────────────┐ │
                    │  │  컴파일타임 인터프리터   │ │  ← 제네릭 특수화
                    │  │  (bytecode 실행기)       │ │  ← GPU 커널 추출
                    │  └─────────────────────────┘ │
                    └────────┬────────────────────┘
                             │
               ┌─────────────┴─────────────┐
               │                           │
       ┌───────▼───────┐          ┌────────▼───────┐
       │  CPU IR (kgen) │          │  GPU IR → PTX  │
       │  Post-Elab     │          │  (NVIDIA/AMD)  │
       │  Optimization  │          └────────────────┘
       └───────┬───────┘
               │
      ┌────────▼────────┐
      │   LLVM 다이얼렉트│  ← kgen → llvm dialect 변환
      │   로 번역        │
      └────────┬────────┘
               │
    ┌──────────▼──────────────────────────────┐
    │          LLVM 2단계 병렬 파이프라인       │
    │  ┌──────────────┐  ┌──────────────────┐ │
    │  │ opt (최적화)  │  │  llc (코드젠)    │ │
    │  │  병렬 서브모듈│  │  병렬 함수단위   │ │
    │  └──────────────┘  └──────────────────┘ │
    └──────────┬──────────────────────────────┘
               │
    ┌──────────▼──────────┐
    │   네이티브 바이너리   │
    │  (x86 / ARM / GPU)  │
    └─────────────────────┘
```

---

## 🧱 1. MLIR — 컴파일러의 뼈대

### MLIR이 왜 특별한가?

기존 LLVM은 **단일 IR(Intermediate Representation)** 구조입니다. MLIR은 **다단계 다이얼렉트 시스템**으로, 의미를 단계적으로 보존합니다.

```
[Mojo 소스 수준]     → lit 다이얼렉트
[중간 시스템 수준]   → kgen 다이얼렉트
[제어흐름]           → hlcf 다이얼렉트
[라이브러리 연산]    → pop 다이얼렉트
[코루틴/클로저]      → coro 다이얼렉트
[컴파일타임 인터프]  → interp 다이얼렉트
[최종 코드젠]        → llvm 다이얼렉트 (업스트림)
```

💡 **핵심 통찰:** Mojo는 arith, vector, affine, MemRef, Linalg 같은 표준 MLIR 다이얼렉트를 사용하지 않습니다. 이유: 생산 품질 불안정, 불완전한 커버리지. 대신 모든 기능을 **Mojo 라이브러리 코드**로 직접 구현합니다.

---

## 🎭 2. Mojo 6개 다이얼렉트 완전 해부

### 다이얼렉트 계층 구조

```
높은 추상화
     ▲
     │  lit    (소스에 가장 근접)
     │  kgen   (핵심 중간 다이얼렉트)
     │  hlcf   (고수준 제어 흐름)
     │  pop    (라이브러리 인터페이스)
     │  coro   (코루틴/async)
     │  interp (컴파일타임 인터프리터)
     ▼
낮은 추상화
```

---

## ⚙️ 3. 컴파일 4단계

### PHASE 1: 파싱
```
.mojo 파일 → Lexer (토큰) → Parser (AST) → lit 다이얼렉트 IR
```

### PHASE 2: Pre-Elaboration
```
lit IR → Semantic Check → Early Optimization → kgen 다이얼렉트
```

### PHASE 3: Elaboration (제네릭 특수화)
```
kgen IR → 컴파일타임 인터프리터 → 구체 IR
         (제네릭 인스턴스화, GPU 코드 추출)
```

### PHASE 4: Post-Elaboration + LLVM
```
kgen IR (구체) → Post-Opt → LLVM IR → 2단계 병렬 컴파일 → 바이너리
```

---

## ⚡ 4. 최적화 파이프라인

**문제:** LLVM이 전체 컴파일 시간의 60~80% 차지

**해결:**
1. 작업을 MLIR로 이전 (LLVM 단순화)
2. 함수별 병렬 처리
3. IR 크기를 일찍부터 줄이기
4. MLIR native 병렬화
5. 2단계 파이프라인 (모듈 → 함수 분할)

**결과:** LLVM 시간 60~80% → 20~30%로 감소

---

## 🔐 5. 소유권 시스템

### 3단계 타입 체킹

```
1. Context-Insensitive Type Checker
   → owned / borrowed / inout (mut) 분류

2. Lifetime Checker
   → 라이프타임 추적, 참조 유효성 확인

3. Drop Insertion
   → 스코프 끝에 __del__ 자동 삽입 (GC 없음)
```

### 소유권 규칙

```python
fn take(owned x: MyType):      # 완전 이전
    ...

fn read(borrowed x: MyType):   # 불변 참조
    ...

fn modify(mut x: MyType):      # 가변 참조
    ...
```

---

## 🧬 6. 컴파일타임 메타프로그래밍

### 파라미터 특수화

```python
fn vector_op[Width: Int, T: DType](
    data: SIMD[T, Width]
) -> SIMD[T, Width]:
    return data * 2

# 호출 시
vector_op[8, DType.float32](...)
# → Elaborator가 Width=8, T=float32로 특수화
# → 런타임 오버헤드 0
```

### `__mlir_op` — MLIR 직접 접근

```python
var x: __mlir_type.i1
let result = __mlir_op.`index.castu`[
    _type=__mlir_type.index
](x)
```

---

## 🎮 7. GPU 컴파일 경로

```
Elaboration Phase에서 GPU 코드 분리!

kgen IR → GPU 함수 감지 → PTX/HSAIL 생성 → CPU IR에 임베드
```

### Layout Algebra

```
Global Matrix
  ↓ tile (타이링)
Thread Block Tile
  ↓ warp_tile (워프 분할)
Warp Tile
  ↓ vectorize (SIMD)
SIMD 벡터
  ↓ swizzle (뱅크 충돌 방지)
최적 공유 메모리 패턴
```

---

## 📦 8. Parametric Bytecode

기존 C++: 모든 타입/하드웨어 조합을 미리 컴파일 (Flash Attention: 300MB, 2시간+)

Mojo의 Parametric Bytecode:
- 파라미터 미전개 IR (소스 없이 배포)
- 사용자 환경에서 JIT 컴파일
- 캐시에 저장
- 2회차부터 즉시 로드

---

## 🗂️ 9. 표준 라이브러리 구조

```
stdlib/
├── builtin/      ← Int, Float, Bool, SIMD...
├── collections/  ← List, Dict, Set, Optional...
├── memory/       ← UnsafePointer, Reference...
├── gpu/          ← GPU 커널 추상화
└── layout/       ← Layout Algebra 구현
```

---

## 📊 컴파일러 아키텍처 치트시트

```
╔════════════════════════════════════════════════════════╗
║  DIALECTS (고→저)                                     ║
║  lit → kgen → (hlcf/pop/coro/interp) → llvm         ║
╠════════════════════════════════════════════════════════╣
║  PHASES                                               ║
║  1. Parse      : mojo → lit IR                       ║
║  2. Pre-Elab   : semantic check, lit → kgen          ║
║  3. Elaboration: generic specialization + GPU        ║
║  4. Post-Elab  : optimization + 2-level parallel     ║
╠════════════════════════════════════════════════════════╣
║  MEMORY SAFETY                                        ║
║  owned / borrowed / mut + Lifetime Checker           ║
╠════════════════════════════════════════════════════════╣
║  KEY INSIGHT                                          ║
║  MLIR → IR 크기 조기 감소 → LLVM 병렬화              ║
║  LLVM 시간: 60~80% → 20~30%로 감소                  ║
╚════════════════════════════════════════════════════════╝
```

---

**작성일:** 2026-03-12
**출처:** LLVM 2023/2024 Devmtg, Modular Tech Talk
