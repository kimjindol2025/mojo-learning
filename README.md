# Mojo 언어 완전 학습 저장소

> **Mojo (🔥)** — Python 문법 + C++ 성능의 혁신적 AI/ML 언어

## 📋 학습 현황 대시보드

| 단계 | 주제 | 상태 | 목표 완료일 |
|------|------|------|-----------|
| Step 1 | 환경 설정 & Hello World | ⏳ 예정 | 2026-03-12 |
| Step 2 | 기본 문법과 타입 | ⏳ 예정 | 2026-03-13 |
| Step 3 | 타입 시스템 (값/참조) | ⏳ 예정 | 2026-03-14 |
| Step 4 | 컬렉션과 메모리 | ⏳ 예정 | 2026-03-15 |
| Step 5 | 소유권 (Ownership) | ⏳ 예정 | 2026-03-16 |
| Step 6 | 함수와 고차 프로그래밍 | ⏳ 예정 | 2026-03-17 |
| Step 7 | 구조체와 객체 | ⏳ 예정 | 2026-03-18 |
| Step 8 | Traits와 Protocols | ⏳ 예정 | 2026-03-19 |
| Step 9 | 성능 최적화 | ⏳ 예정 | 2026-03-20 |
| Step 10 | AI/ML 프로젝트 | ⏳ 예정 | 2026-03-25 |

## 🗂️ 저장소 구조

```
mojo-learning/
├── README.md                    # 이 파일 (대시보드)
├── LEARNING_REPORT.md           # 종합 학습 리포트
├── PROGRESS.md                  # 일별 학습 진행 기록
│
├── step01-setup/                # Step 1: 환경 설정
│   ├── NOTES.md
│   └── hello.mojo
│
├── step02-basics/               # Step 2: 기본 문법
│   ├── NOTES.md
│   ├── variables.mojo
│   ├── control_flow.mojo
│   └── functions.mojo
│
├── step03-types/                # Step 3: 타입 시스템
│   ├── NOTES.md
│   ├── value_semantics.mojo
│   └── reference_semantics.mojo
│
├── step04-collections/          # Step 4: 컬렉션과 메모리
│   ├── NOTES.md
│   ├── lists.mojo
│   ├── dicts.mojo
│   └── strings.mojo
│
├── step05-ownership/            # Step 5: 소유권
│   ├── NOTES.md
│   └── memory_management.mojo
│
├── step06-functions/            # Step 6: 함수와 고차 프로그래밍
│   ├── NOTES.md
│   ├── function_basics.mojo
│   └── lambdas.mojo
│
├── step07-structs/              # Step 7: 구조체와 객체
│   ├── NOTES.md
│   ├── struct_definition.mojo
│   └── methods.mojo
│
├── step08-traits/               # Step 8: Traits와 Protocols
│   ├── NOTES.md
│   └── trait_implementation.mojo
│
├── step09-performance/          # Step 9: 성능 최적화
│   ├── NOTES.md
│   ├── simd.mojo
│   ├── parallelization.mojo
│   └── benchmarks.mojo
│
├── step10-aiml/                 # Step 10: AI/ML 프로젝트
│   ├── NOTES.md
│   ├── neural_network.mojo
│   └── matrix_operations.mojo
│
└── compiler-analysis/           # 심화: 컴파일러 분석
    ├── mojo_ast.md
    ├── llvm_integration.md
    └── python_interop.md
```

## 🚀 빠른 시작

```bash
# Mojo 설치 (macOS / Linux)
curl -sSL https://install.modular.com | bash

# 버전 확인
mojo --version
# mojo 0.7.x (또는 최신)

# 코드 실행
mojo step01-setup/hello.mojo

# 컴파일
mojo build hello.mojo
```

## 📊 학습 통계

- **시작일**: 2026-03-10 (계획)
- **목표 완료**: 2026-03-25 (15일)
- **코드 파일 수**: 예상 30+개
- **총 학습 시간**: 예상 40-50시간

## ⚡ Mojo가 중요한 이유

```
Python 문법의 친숙함        Python 개발자 진입장벽 매우 낮음
     + C++ 성능 (수십배)  ↓
     + 자동 메모리 관리     Rust보다 배우기 쉬움
     + AI/ML 최적화        NumPy/PyTorch와 호환
     ──────────────────────────────────────
     = 2026 AI 개발의 표준 언어 (예상)
```

## 🎯 학습 목표

1. ✅ Python과의 차이점 이해 (타입 안전성, 성능)
2. ✅ Mojo의 고유 개념 마스터 (ownership, borrowed arguments)
3. ✅ SIMD와 병렬화를 통한 성능 최적화
4. ✅ NumPy 스타일의 고성능 배열 연산
5. ✅ 작은 AI/ML 모델 구현 및 최적화

## 🔗 참고 리소스

| 리소스 | 링크 | 용도 |
|--------|------|------|
| 공식 문서 | docs.modular.com/mojo | 언어 레퍼런스 |
| GitHub | github.com/modularml/mojo | 소스 & 이슈 |
| Playground | playground.modular.com | 온라인 실행 |
| Discord | 커뮤니티 서버 | Q&A |
| Modular Blog | modular.com/blog | 뉴스 & 튜토리얼 |

## 📝 학습 패턴

각 Step은 다음 구조를 따릅니다:
- **NOTES.md** — 핵심 개념 설명
- **\*.mojo** — 실제 코드 예제 (3-5개)
- **연습 문제** — 이해도 확인

## 🎓 선행 요구사항

- Python 기본 문법 (for, if, def 등) 숙지
- 메모리 개념 기초 이해 (포인터 불필요)
- 선택: Rust 경험 (helpful but not required)

---

*저장소: gogs.dclub.kr/kim/mojo-learning*
*작성자: Claude Haiku 4.5 (패턴 학습 프로젝트)*
*마지막 업데이트: 2026-03-10*
