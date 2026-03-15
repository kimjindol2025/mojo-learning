# Phase 16 Step 3: 테스트 강화 계획

**목표:** Testing Score 60% → 85%+ 향상
**추가 테스트 파일:** 5개
**예상 라인:** 450줄 (+ verify-step3.js 개선)

---

## 📊 현재 상태

```
테스트 커버리지:
✅ test_scope.mojo       - 스코프 관리, 변수 가리기
✅ test_undefined.mojo   - 정의되지 않은 변수
✅ test_unused.mojo      - 미사용 변수
✅ test_builtins.mojo    - 내장 함수
✅ test_overload.mojo    - 함수 오버로딩

Gap Analysis:
❌ 재귀 함수 & 호출 체인 (Recursion)
❌ 타입 불일치 패턴 (Type Safety)
❌ 복잡한 중첩 스코프 (Complex Scopes)
❌ 에러 복구 시나리오 (Error Recovery)
❌ 대규모 코드 처리 (Performance)

Testing Score: 60% → Target: 85%+
```

---

## 🆕 추가 테스트 파일

### 1. test_recursive.mojo (100줄)

**목표:** 재귀 함수, 깊은 호출 체인, 상호 재귀

```mojo
// 단순 재귀
fn factorial(n: Int) -> Int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

// 상호 재귀 (mutual recursion)
fn is_even(n: Int) -> Bool:
    if n == 0:
        return true
    return is_odd(n - 1)

fn is_odd(n: Int) -> Bool:
    if n == 0:
        return false
    return is_even(n - 1)

// 깊은 호출 체인
fn a() -> Int:
    return b() + 1

fn b() -> Int:
    return c() + 1

fn c() -> Int:
    return d() + 1

fn d() -> Int:
    return e() + 1

fn e() -> Int:
    return 10

// 재귀 + 순환 호출
fn fibonacci(n: Int) -> Int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

// 재귀 내부에서 중첩 함수
fn outer_recursive(n: Int) -> Int:
    fn inner(x: Int) -> Int:
        if x <= 0:
            return 1
        return x * inner(x - 1)
    return inner(n)

// 재귀 호출 중 변수 추적
fn recursive_with_state(n: Int, acc: Int) -> Int:
    if n <= 0:
        return acc
    let new_acc = acc + n
    return recursive_with_state(n - 1, new_acc)
```

**검증 포인트:**
- ✅ 재귀 함수 정의 인식
- ✅ 자기 호출 (self-call) 감지
- ✅ 상호 재귀 (mutual recursion) 처리
- ✅ 깊은 호출 체인 스코프 관리
- ✅ 재귀 내 로컬 변수 추적
- ✅ 꼬리 재귀 패턴 인식

---

### 2. test_type_mismatch.mojo (80줄)

**목표:** 타입 불일치 감지, 암시적 변환 패턴

```mojo
// 변수 타입 명시
fn type_declared() -> Int:
    let x: Int = 10
    let y: Float = 3.14
    let z: String = "hello"
    return x

// 변수 재할당 (타입 안정성)
fn variable_reassign():
    let x: Int = 10
    x = 20            // OK - 같은 타입
    x = 3.14          // Type mismatch
    x = "hello"       // Type mismatch

// 함수 인자 타입
fn typed_function(a: Int, b: Float) -> Int:
    return a + int(b)

fn call_typed():
    let result1 = typed_function(10, 3.14)      // OK
    let result2 = typed_function(10, "wrong")   // Type mismatch
    let result3 = typed_function("wrong", 3.14) // Type mismatch

// 반환 타입 체크
fn returns_int() -> Int:
    return 42

fn returns_string() -> String:
    return "hello"

fn return_type_mismatch() -> Int:
    if true:
        return "wrong"  // Type mismatch
    return 42

// 배열 요소 타입
fn array_types():
    let int_arr: [Int] = [1, 2, 3]
    let str_arr: [String] = ["a", "b", "c"]

    int_arr = str_arr  // Type mismatch
    let mixed = [1, "two", 3.0]  // Mixed types

// 연산식 타입
fn arithmetic_types():
    let x: Int = 10
    let y: Float = 3.14
    let result1 = x + y        // Type mismatch in +
    let result2 = x + int(y)   // OK - explicit cast

// 함수 오버로딩 & 타입
fn process(x: Int) -> String:
    return str(x)

fn process(x: String) -> Int:
    return int(x)

fn overload_type_check():
    let r1 = process(10)       // calls Int version
    let r2 = process("42")     // calls String version
    let r3: String = process(10)  // OK
    let r4: Int = process("42")   // OK
```

**검증 포인트:**
- ✅ 타입 선언 파싱
- ✅ 타입 불일치 감지
- ✅ 암시적 변환 규칙
- ✅ 함수 인자 타입 확인
- ✅ 반환 타입 검증
- ✅ 배열 요소 타입
- ✅ 연산식 타입 추론

---

### 3. test_complex_scopes.mojo (120줄)

**목표:** 깊은 중첩 스코프, 변수 섀도잉, 스코프 경계

```mojo
// 깊은 중첩 (5+ 레벨)
fn deeply_nested():
    let level1 = 1

    if level1 > 0:
        let level2 = 2

        if level2 > 1:
            let level3 = 3

            if level3 > 2:
                let level4 = 4

                if level4 > 3:
                    let level5 = 5
                    print(level1 + level2 + level3 + level4 + level5)

// 변수 섀도잉 체인
fn shadowing_chain():
    let x = 1       // global scope x

    if true:
        let x = 2   // shadows outer x

        if true:
            let x = 3  // shadows outer x

            if true:
                let x = 4  // shadows outer x
                print(x)   // refers to innermost x

            print(x)   // refers to x = 3

        print(x)   // refers to x = 2

    print(x)   // refers to x = 1

// 루프 변수와 스코프
fn loop_scope_complex():
    let x = 10

    for i in range(5):
        let y = i * 2

        while y > 0:
            let z = y - 1

            if z > 0:
                let w = z * x
                print(w)

            y = y - 1

// 함수 내 함수 (클로저 패턴)
fn nested_functions():
    let outer_var = 100

    fn inner():
        let inner_var = 200

        fn deep_inner():
            let deep_var = 300
            return outer_var + inner_var + deep_var

        return deep_inner()

    return inner()

// 조건부 변수 정의
fn conditional_defs():
    if true:
        let conditional_true = 1
    else:
        let conditional_false = 2

    // conditional_true / conditional_false 사용 불가능

// 루프 변수 재사용
fn reuse_loop_var():
    for i in range(5):
        let x = i
        print(x)

    for i in range(10, 15):
        let x = i * 2  // 다른 스코프이므로 새 x
        print(x)

// 모든 변수 모두 사용 (scope exit에 경고 없음)
fn all_used():
    let a = 1
    let b = 2
    let c = 3
    let d = a + b + c
    print(d)

// 일부 변수 미사용
fn partial_unused():
    let used = 1
    let unused1 = 2
    let unused2 = 3
    return used
```

**검증 포인트:**
- ✅ 5+ 레벨 깊은 중첩 처리
- ✅ 다중 섀도잉 (triple/quadruple shadowing)
- ✅ 섀도잉 제거 시 올바른 변수 참조
- ✅ 루프 변수 스코프 경계
- ✅ 조건부 정의 스코프 격리
- ✅ 루프 변수 재사용 가능
- ✅ 스코프 경계에서의 미사용 변수 경고

---

### 4. test_error_recovery.mojo (100줄)

**목표:** 여러 에러 감지, 에러 복구, 부분 파싱

```mojo
// 에러 1: 정의되지 않은 변수 여러 개
fn multiple_undefined():
    let x = undefined1 + undefined2 + undefined3
    return undefined4

// 에러 2: 혼합 에러 (일부는 정의, 일부는 미정의)
fn mixed_defined_undefined():
    let a = 1
    let b = undefined_b
    let c = a + undefined_c
    return a + b + c

// 에러 3: 중첩된 에러
fn nested_errors():
    if undefined_cond:
        let x = undefined_inner1

        while undefined_inner2:
            let y = undefined_inner3
            return y

    return undefined_outer

// 에러 4: 변수 재정의
fn redefinition_error():
    let x = 1
    let x = 2  // Error: redefined
    let x = 3  // Error: redefined again

// 에러 5: 함수 호출 + 미정의 변수
fn function_call_error():
    let result = undefined_func(undefined_arg1, undefined_arg2)
    return result + undefined_result

// 경고 1: 미사용 변수들
fn unused_warnings():
    let unused1 = 1
    let unused2 = 2
    let used = 3
    return used
    // unused1, unused2에 대한 경고 기대

// 경고 2: 미사용 파라미터
fn unused_param_warning(unused1: Int, unused2: Int, used: Int) -> Int:
    return used

// 에러 + 경고 혼합
fn mixed_errors_warnings():
    let unused = 1
    let undefined = undefined_var
    let used = 2
    return used + undefined  // 에러 (undefined)

// 복구: 에러 이후 계속 파싱
fn recovery_continues():
    let a = undefined1
    let b = 2
    let c = undefined2
    let d = 4
    return b + d

// 대량 에러
fn mass_errors():
    return (undefined1 + undefined2) * (undefined3 - undefined4)
        + undefined5 / undefined6
        - undefined7 % undefined8
```

**검증 포인트:**
- ✅ 여러 undefined 변수 모두 감지
- ✅ 부분 정의 변수 혼합 처리
- ✅ 중첩 스코프 에러 추적
- ✅ 변수 재정의 감지
- ✅ 함수 호출 + 미정의 조합
- ✅ 미사용 변수 경고
- ✅ 미사용 파라미터 경고
- ✅ 에러 복구 계속 파싱
- ✅ 에러 개수 정확성

---

### 5. test_performance.mojo (150줄)

**목표:** 대규모 코드 처리, 성능 측정

```mojo
// 생성된 함수 100개
fn func_0() -> Int:
    let x = 0
    return x

fn func_1() -> Int:
    let x = 1
    return x

// ... (자동 생성: func_2 ~ func_99)

fn func_99() -> Int:
    let x = 99
    return x

// 생성된 변수 1000개 (루프로)
fn large_variable_scope():
    let v_0 = 0
    let v_1 = 1
    let v_2 = 2
    // ... (v_3 ~ v_999)
    return v_999

// 깊은 중첩 (50+ 레벨)
fn deeply_nested_50():
    let a0 = 0
    if a0 > 0:  // level 2
        let a1 = 1
        if a1 > 0:  // level 3
            let a2 = 2
            if a2 > 0:  // level 4
                let a3 = 3
                // ... (continue to level 50+)
                if a49 > 0:  // level 51
                    let a50 = 50
                    print(a50)

// 복잡한 표현식 (100+ 토큰)
fn complex_expression():
    let result = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10
                + 11 + 12 + 13 + 14 + 15 + 16 + 17 + 18 + 19 + 20
                + 21 + 22 + 23 + 24 + 25 + 26 + 27 + 28 + 29 + 30
                // ... (continue)
    return result

// 많은 변수 사용
fn many_variable_use():
    let v1 = 1
    let v2 = 2
    let v3 = 3
    // ... (v99)
    return v1 + v2 + v3 + ... + v99

// 대량 함수 호출
fn many_function_calls():
    let r1 = func_0()
    let r2 = func_1()
    let r3 = func_2()
    // ... (call func_0 ~ func_99)
    return r1 + r2 + ... + r99

// 대규모 배열
fn large_array():
    let arr = [1, 2, 3, ..., 1000]
    return len(arr)

// 성능 스트레스: 긴 함수 본문
fn long_function_body():
    let x = 1
    print(x)
    let y = 2
    print(y)
    // ... (100+ 문장)
    return x + y
```

**검증 포인트:**
- ✅ 100+ 함수 정의 처리
- ✅ 1000+ 변수 인식
- ✅ 50+ 깊이 스코프 처리
- ✅ 100+ 토큰 표현식 파싱
- ✅ 많은 함수 호출 추적
- ✅ 성능 < 100ms
- ✅ 메모리 사용 합리적

---

## 🔧 verify-step3.js 개선

### 기능 추가

```javascript
// 1. 성능 측정
function measureAnalysisPerformance(file) {
    const startTime = performance.now();
    const result = analyzeFile(file);
    const duration = performance.now() - startTime;
    return { ...result, duration };
}

// 2. 상세 에러 분류
function categorizeErrors(errors) {
    return {
        undefined_variables: errors.filter(...),
        redefinitions: errors.filter(...),
        type_mismatches: errors.filter(...)
    };
}

// 3. 경고 분류
function categorizeWarnings(warnings) {
    return {
        unused_variables: warnings.filter(...),
        unused_parameters: warnings.filter(...),
        unreachable_code: warnings.filter(...)
    };
}

// 4. 테스트 결과 비교
function compareWithReference(testName, result) {
    const expected = EXPECTED_RESULTS[testName];
    return {
        error_count_match: result.errors.length === expected.error_count,
        warning_count_match: result.warnings.length === expected.warning_count,
        error_types_match: categorizeErrors(result.errors) === ...,
        details: ...
    };
}

// 5. CSV 리포트 생성
function generateCsvReport(results) {
    // test_name, status, errors, warnings, duration, details
}
```

### 출력 개선

```
📊 Testing Score Breakdown:

Category              Coverage    Tests    Pass Rate
─────────────────────────────────────────────────────
Scope Management      100%        10/10    ✅ 100%
Undefined Vars        100%        8/8      ✅ 100%
Unused Vars           100%        7/7      ✅ 100%
Built-in Functions    100%        10/10    ✅ 100%
Function Overloading  100%        6/6      ✅ 100%
─────────────────────────────────────────────────────
Recursion             NEW         5/5      ✅ 100%
Type System           NEW         8/8      ✅ 100%
Complex Scopes        NEW         9/9      ✅ 100%
Error Recovery        NEW         7/7      ✅ 100%
Performance           NEW         5/5      ✅ 100%
─────────────────────────────────────────────────────
TOTAL:               85%+        78/78     ✅ 100%
```

---

## 📈 예상 개선

```
Before:  60% Testing Score
After:   85%+ Testing Score

Breakdown:
- Scope management:     10%  → 100%
- Error handling:       5%   → 100%
- Recursion support:    0%   → 100%
- Type safety:          0%   → 100%
- Performance:          0%   → 100%
- Error recovery:       0%   → 100%

Total improvement: +25% testing confidence
```

---

## ✅ Success Criteria

✅ 5개 추가 테스트 파일 생성
✅ verify-step3.js에 자동 통합
✅ 모든 테스트 정의된 예상값과 매칭
✅ Testing Score 85%+ 달성
✅ 커버리지 리포트 생성
✅ 성능 메트릭 수집

---

## 📅 예상 일정

| Task | Lines | Days |
|------|-------|------|
| test_recursive.mojo | 100 | 1 |
| test_type_mismatch.mojo | 80 | 1 |
| test_complex_scopes.mojo | 120 | 1 |
| test_error_recovery.mojo | 100 | 1 |
| test_performance.mojo | 150 | 1 |
| verify-step3.js 개선 | 100 | 1 |
| 결과 분석 & 문서 | - | 1 |

**Total:** 7일

---

**이 개선을 통해 Step 3 검증 완성도를 60% → 85%+로 향상시킬 수 있습니다.**
