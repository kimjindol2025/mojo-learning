# Phase 16: Mojo Self-Hosting (점진 마이그레이션)

**전략:** 계층별 마이그레이션 + diff 검증

## 마이그레이션 순서 & 검증 방식

### Step 1️⃣: Lexer → Mojo

**파일:** `lexer-indent.js` (432줄)
**의존성:** None (독립적)
**검증:** 토큰 배열 비교

**Mojo 구현 틀:**
```mojo
struct Token:
    type: String
    value: String
    line: Int
    column: Int

struct IndentationLexer:
    source: String
    tokens: List[Token]
    
    fn tokenize() -> List[Token]:
        # 구현
        pass
```

**검증 방식:**
```bash
# 1. JS 버전 실행
node compiler-indent.js test.mojo --tokens > output-js.json

# 2. Mojo 버전 실행
./lexer-test output-js.json > output-mojo.json

# 3. Diff 비교
diff output-js.json output-mojo.json
→ 완전 일치 = PASS
→ 불일치 = 디버깅
```

**예상 소요:** 3-4일
**난이도:** ⭐ (가장 간단)

---

### Step 2️⃣: Parser → Mojo

**파일:** `parser-indent.js` (995줄)
**의존성:** Step 1 (Lexer)
**검증:** AST JSON 비교

**검증 방식:**
```bash
# 1. Mojo Lexer + JS Parser
mojo-lexer test.mojo | js-parser > ast-js.json

# 2. Mojo Lexer + Mojo Parser
mojo-lexer test.mojo | mojo-parser > ast-mojo.json

# 3. Diff
diff ast-js.json ast-mojo.json
```

**예상 소요:** 5-7일
**난이도:** ⭐⭐ (재귀적 파싱)

---

### Step 3️⃣: Semantic Analyzer → Mojo

**파일:** `semantic-analyzer.js` (365줄)
**의존성:** Step 2 (Parser)
**검증:** 심볼 테이블 + 경고 비교

**검증 방식:**
```bash
# 1. JS 세마 분석
mojo-parser test.mojo | js-semantic > symbols-js.json

# 2. Mojo 세마 분석
mojo-parser test.mojo | mojo-semantic > symbols-mojo.json

# 3. Diff
diff symbols-js.json symbols-mojo.json
```

**예상 소요:** 2-3일
**난이도:** ⭐⭐

---

### Step 4️⃣: IR Generator → Mojo

**파일:** `ir-generator.js` (350줄)
**의존성:** Step 3 (Semantic)
**검증:** LLVM IR 텍스트 비교

**검증 방식:**
```bash
# 1. JS IR 생성
mojo-ast test.mojo | js-ir > ir-js.ll

# 2. Mojo IR 생성
mojo-ast test.mojo | mojo-ir > ir-mojo.ll

# 3. Diff (정규표현식으로 임시변수명 정규화)
normalize_ir ir-js.ll | diff - <(normalize_ir ir-mojo.ll)
```

**예상 소요:** 2-3일
**난이도:** ⭐⭐

---

### Step 5️⃣: Assembly Generator → Mojo

**파일:** `asm-generator.js` (525줄)
**의존존성:** Step 4 (IR)
**검증:** x86-64 ASM 텍스트 비교

**검증 방식:**
```bash
# 1. JS ASM 생성
mojo-ir test.mojo | js-asm > asm-js.s

# 2. Mojo ASM 생성
mojo-ir test.mojo | mojo-asm > asm-mojo.s

# 3. Diff
diff asm-js.s asm-mojo.s
→ 완전 일치 또는 최소 차이
```

**예상 소요:** 3-4일
**난이도:** ⭐⭐⭐ (가장 복잡)

---

### Step 6️⃣: Compiler Driver → Mojo

**파일:** `compiler-indent.js` (200줄)
**의존성:** Step 1-5 (모든 단계)
**검증:** 전체 파이프라인 검증

**검증 방식:**
```bash
# 1. JS 컴파일러 (node)
node compiler-indent.js test.mojo --asm-binary test-js

# 2. Mojo 컴파일러 (self-hosted)
./mojo-compiler test.mojo --asm-binary test-mojo

# 3. 바이너리 비교
diff test-js test-mojo
→ 완전 일치 = PASS
→ 다르면 계산 검증 (결과가 같은지)

# 4. 실행 검증
./test-js vs ./test-mojo
→ 같은 exit code / 같은 output
```

**예상 소요:** 1-2일
**난이도:** ⭐ (통합만 하면 됨)

---

## 타임라인

| Step | 모듈 | 라인 | 예상시간 | 누적 |
|------|------|------|---------|------|
| 1 | Lexer | 432 | 3-4일 | 3-4일 |
| 2 | Parser | 995 | 5-7일 | 8-11일 |
| 3 | Semantic | 365 | 2-3일 | 10-14일 |
| 4 | IR | 350 | 2-3일 | 12-17일 |
| 5 | Assembly | 525 | 3-4일 | 15-21일 |
| 6 | Driver | 200 | 1-2일 | 16-23일 |

**총 예상:** 16-23일 (약 3주)

---

## 검증 체크리스트

### 각 Step마다

- [ ] Mojo 코드 작성 완료
- [ ] JS 버전과 동일한 입출력 확인
- [ ] Diff 0개 (또는 무시 가능한 차이)
- [ ] 테스트 케이스 5개 이상 검증
- [ ] 혹시 모를 엣지 케이스 처리
- [ ] Gogs 커밋 (Step N 완료)

### 최종 단계

- [ ] 자체호스팅 달성 (Mojo 컴파일러로 자신의 Lexer 컴파일)
- [ ] 전체 테스트 재실행
- [ ] Gogs에 최종 커밋

---

## 주의사항

### 1. 타입 시스템
- Mojo 타입 시스템이 JavaScript와 다름
- 배열/맵은 명시적 제네릭 필요
- String 다루기 주의 (encoding)

### 2. 메모리 관리
- JavaScript: GC 자동
- Mojo: 메모리 관리 필수
- 대용량 문자열 처리 시 성능 확인

### 3. 모듈 구조
- Mojo는 파일 단위 모듈
- JavaScript 클래스를 Mojo struct + 함수로 변환
- import 경로 주의

### 4. 디버깅
- 각 Step마다 print 디버깅 포함
- Diff 결과를 바로 확인
- 불일치 시 JS 코드 다시 읽고 비교

---

## 자체호스팅 검증 (최종)

```bash
# 최종 목표: Mojo 컴파일러로 자신의 코드를 컴파일
./mojo-compiler ./lexer.mojo --asm-binary lexer-binary
./lexer-binary test.mojo --tokens > tokens.json

# 결과 검증
diff tokens.json <(node lexer-indent.js test.mojo --tokens)
→ 일치 = 자체호스팅 성공! 🎉
```

---

## 예상 최종 상태

```
/mojo-learning/
├── compiler-impl/
│   ├── lexer.mojo           [자체호스팅] ✅
│   ├── parser.mojo          [자체호스팅] ✅
│   ├── semantic.mojo        [자체호스팅] ✅
│   ├── ir-gen.mojo          [자체호스팅] ✅
│   ├── asm-gen.mojo         [자체호스팅] ✅
│   ├── driver.mojo          [자체호스팅] ✅
│   │
│   ├── [기존 JS 버전 - 검증용만 보관]
│   ├── lexer-indent.js      [참고용]
│   ├── parser-indent.js     [참고용]
│   └── ...
│
└── PHASE16_MIGRATION_COMPLETE.md
```

---

**Status:** Phase 16 계획 완료, Step 1 준비 대기
**Next:** Lexer → Mojo 마이그레이션 시작
