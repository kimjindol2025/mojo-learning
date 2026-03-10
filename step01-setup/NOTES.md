# Step 1: 환경 설정 & Hello World

> 목표: Mojo 컴파일러 설치 및 첫 프로그램 실행

## 📋 학습 내용

1. Mojo 설치
2. 개발 환경 구성
3. Hello World 작성 및 실행
4. 컴파일 옵션 이해

---

## 🚀 Mojo 설치

### 시스템 요구사항

```
OS: macOS (Apple Silicon/Intel) 또는 Linux (Ubuntu 20.04+)
CPU: Intel Core i5+ 또는 Apple Silicon
메모리: 8GB 이상
디스크: 2GB 여유 공간
```

### 설치 방법

#### Linux (Ubuntu)

```bash
# 1. 설치 스크립트 실행
curl -sSL https://install.modular.com | bash

# 2. 환경 변수 설정
export PATH="$HOME/.modular/pkg/mojo/bin:$PATH"

# 3. 설치 확인
mojo --version
# 출력: mojo 0.7.x ...
```

#### macOS

```bash
# Homebrew 사용
brew install mojo

# 또는 직접 설치
curl -sSL https://install.modular.com | bash
```

### 설치 확인

```bash
$ mojo --version
mojo 0.7.0

$ which mojo
/home/user/.modular/pkg/mojo/bin/mojo

$ mojo --help
# Mojo 헬프 텍스트 출력
```

---

## ⚙️ 개발 환경 설정

### VS Code 플러그인

```bash
# 1. VS Code 설치
# https://code.visualstudio.com

# 2. 확장 프로그램 검색
Extensions → Search "Mojo"

# 3. Modular 공식 플러그인 설치
- Name: Mojo
- Author: Modular
- 확인 버튼 클릭
```

### 플러그인 기능

```
✅ 문법 강조 (Syntax Highlighting)
✅ 자동 완성 (Intellisense)
✅ 코드 포매팅 (Format)
✅ 디버깅 (Debug)
✅ Lint 및 경고
```

### VS Code 설정 (optional)

`.vscode/settings.json`:
```json
{
  "[mojo]": {
    "editor.defaultFormatter": "modularml.mojo",
    "editor.formatOnSave": true,
    "editor.tabSize": 4
  },
  "files.associations": {
    "*.mojo": "mojo"
  }
}
```

---

## 📝 첫 번째 프로그램: Hello World

### 코드 작성

**파일: `hello.mojo`**

```mojo
fn main():
    print("Hello, Mojo! 🔥")
```

### 실행

```bash
# 방법 1: JIT 컴파일 (개발)
mojo run hello.mojo

# 출력:
# Hello, Mojo! 🔥
```

### 코드 분석

```mojo
fn main():           # 함수 정의 (fn: 정적 타입)
    print(...)       # 표준 출력 (Python과 동일)
```

**특징:**
- `fn` 키워드: 컴파일 타임 최적화 가능
- `print()`: Python 호환 함수
- 타입 명시 없음: Mojo의 타입 추론

---

## 🔧 컴파일 옵션

### JIT 컴파일 (개발)

```bash
# 즉시 실행 (개발 중 빠른 테스트)
mojo run hello.mojo
```

**장점:**
- 빠른 피드백
- 인터프리터처럼 편함

### AOT 컴파일 (배포)

```bash
# 기본 컴파일
mojo build hello.mojo -o hello
./hello

# 최적화 빌드
mojo build hello.mojo -o hello -O2
```

**옵션:**
```
-o OUTPUT      : 출력 파일명
-O0            : 최적화 없음 (기본)
-O1            : 기본 최적화
-O2            : 높은 최적화
-O3            : 최고 최적화
--stats        : 컴파일 통계
-g             : 디버그 정보
```

### 디버그 빌드

```bash
# 디버그 정보 포함
mojo build hello.mojo -o hello -g

# GDB로 디버깅
gdb ./hello
```

---

## 📊 Step 1 실습 코드들

### 1.1 기본 Hello World

```mojo
# hello.mojo
fn main():
    print("Hello, Mojo! 🔥")
```

### 1.2 다중 출력

```mojo
# multi_print.mojo
fn main():
    print("Line 1")
    print("Line 2")
    print("Line 3")
```

### 1.3 변수와 함께 출력

```mojo
# with_variables.mojo
fn main():
    name = "Mojo"
    version = "0.7"
    print("Language: " + name)
    print("Version: " + version)
```

### 1.4 표준 에러 출력

```mojo
# stderr_output.mojo
fn main():
    print("Normal output")
    # eprintln("Error output")  # Python의 sys.stderr
```

### 1.5 컴파일된 바이너리 실행

```mojo
# compiled_hello.mojo
fn main():
    print("This will be a compiled binary")
```

```bash
$ mojo build compiled_hello.mojo -o hello_bin
$ ./hello_bin
# This will be a compiled binary
```

---

## 🎯 Step 1 완료 기준

```
✅ Mojo 컴파일러 설치 완료
✅ mojo --version으로 확인 가능
✅ hello.mojo 작성 및 실행 성공
✅ 컴파일 옵션 이해
✅ 개발 환경 (VS Code 등) 구성 완료
```

---

## 🔗 참고 자료

| 자료 | 링크 | 설명 |
|------|------|------|
| 공식 설치 | docs.modular.com/mojo | 최신 설치 가이드 |
| 플레이그라운드 | playground.modular.com | 브라우저에서 실행 |
| GitHub | github.com/modularml/mojo | 소스 및 이슈 |

---

## ⚠️ 주의사항

### 1. Python과의 차이

```mojo
# ❌ Python의 `def`도 작동하지만 비추천
def old_style(x):
    return x * 2

# ✅ Mojo의 `fn`을 권장 (최적화 가능)
fn new_style(x: int) -> int:
    return x * 2
```

### 2. 타입 안전성

```mojo
# ❌ 타입 미명시 (경고)
fn add(a, b):
    return a + b

# ✅ 타입 명시 (권장)
fn add(a: int, b: int) -> int:
    return a + b
```

### 3. 성능 고려

```mojo
# fn은 컴파일 타임 최적화가 가능
# def는 런타임 오버헤드 존재
```

---

**작성일:** 2026-03-10
**상태:** Step 1 시작
