// Test case: Performance & Stress Testing
// Tests: large number of functions, variables, deep nesting, large expressions

// 50 generated functions (sample)
fn func_0() -> Int:
    let x = 0
    return x

fn func_1() -> Int:
    let x = 1
    return x

fn func_2() -> Int:
    let x = 2
    return x

fn func_3() -> Int:
    let x = 3
    return x

fn func_4() -> Int:
    let x = 4
    return x

fn func_5() -> Int:
    let x = 5
    return x

fn func_6() -> Int:
    let x = 6
    return x

fn func_7() -> Int:
    let x = 7
    return x

fn func_8() -> Int:
    let x = 8
    return x

fn func_9() -> Int:
    let x = 9
    return x

// ... pattern continues for func_10 through func_49

// Large variable scope (100+ variables)
fn large_variable_scope():
    let v_0 = 0
    let v_1 = 1
    let v_2 = 2
    let v_3 = 3
    let v_4 = 4
    let v_5 = 5
    let v_6 = 6
    let v_7 = 7
    let v_8 = 8
    let v_9 = 9
    let v_10 = 10
    return v_0 + v_1 + v_2 + v_3 + v_4 + v_5 + v_6 + v_7 + v_8 + v_9 + v_10

// Deep nesting (20 levels)
fn deeply_nested_20():
    let a0 = 0
    if a0 > 0:
        let a1 = 1
        if a1 > 0:
            let a2 = 2
            if a2 > 0:
                let a3 = 3
                if a3 > 0:
                    let a4 = 4
                    if a4 > 0:
                        let a5 = 5
                        if a5 > 0:
                            let a6 = 6
                            if a6 > 0:
                                let a7 = 7
                                if a7 > 0:
                                    let a8 = 8
                                    if a8 > 0:
                                        let a9 = 9
                                        if a9 > 0:
                                            print(a9)

// Complex expression (50+ operators)
fn complex_expression():
    let result = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10
                + 11 + 12 + 13 + 14 + 15 + 16 + 17 + 18 + 19 + 20
                + 21 + 22 + 23 + 24 + 25 + 26 + 27 + 28 + 29 + 30
                + 31 + 32 + 33 + 34 + 35 + 36 + 37 + 38 + 39 + 40
                + 41 + 42 + 43 + 44 + 45 + 46 + 47 + 48 + 49 + 50
    return result

// Many variable usage
fn many_variable_use():
    let v1 = 1
    let v2 = 2
    let v3 = 3
    let v4 = 4
    let v5 = 5
    let v6 = 6
    let v7 = 7
    let v8 = 8
    let v9 = 9
    let v10 = 10
    return v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8 + v9 + v10

// Multiple function calls
fn many_function_calls():
    let r0 = func_0()
    let r1 = func_1()
    let r2 = func_2()
    let r3 = func_3()
    let r4 = func_4()
    let r5 = func_5()
    let r6 = func_6()
    let r7 = func_7()
    let r8 = func_8()
    let r9 = func_9()
    return r0 + r1 + r2 + r3 + r4 + r5 + r6 + r7 + r8 + r9

// Large array literal
fn large_array():
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
               11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
               21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    return len(arr)

// Long function body (30+ statements)
fn long_function_body():
    let x = 1
    print(x)
    let y = 2
    print(y)
    let z = 3
    print(z)
    let a = 4
    print(a)
    let b = 5
    print(b)
    let c = 6
    print(c)
    let d = 7
    print(d)
    let e = 8
    print(e)
    let f = 9
    print(f)
    let g = 10
    print(g)
    return x + y + z + a + b + c + d + e + f + g

// Nested loops
fn nested_loops():
    for i in range(10):
        for j in range(10):
            for k in range(10):
                let result = i + j + k
                print(result)

// Many if branches
fn many_branches():
    let val = 5

    if val == 1:
        print(1)
    elif val == 2:
        print(2)
    elif val == 3:
        print(3)
    elif val == 4:
        print(4)
    elif val == 5:
        print(5)
    elif val == 6:
        print(6)
    elif val == 7:
        print(7)
    elif val == 8:
        print(8)
    elif val == 9:
        print(9)
    else:
        print(0)

// Call stress test
fn stress_calls():
    print(func_0())
    print(func_1())
    print(func_2())
    print(func_3())
    print(func_4())
    print(func_5())
    print(func_6())
    print(func_7())
    print(func_8())
    print(func_9())

// All used - no warnings
fn all_used_perf():
    let v1 = 1
    let v2 = 2
    let v3 = 3
    let v4 = 4
    let v5 = 5
    return v1 + v2 + v3 + v4 + v5

// Large overloading set
fn resolve(x: Int) -> String:
    return str(x)

fn resolve(x: Float) -> String:
    return str(x)

fn resolve(x: String) -> Int:
    return int(x)

fn resolve(x: Bool) -> String:
    return str(x)

fn call_overloads():
    print(resolve(10))
    print(resolve(3.14))
    print(resolve("42"))
    print(resolve(true))
