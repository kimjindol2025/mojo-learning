// Test case: Complex Nested Scopes
// Tests: deep nesting, variable shadowing chains, scope boundaries

// Deep nesting (6+ levels)
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

                    if level5 > 4:
                        let level6 = 6
                        print(level1 + level2 + level3 + level4 + level5 + level6)

// Variable shadowing chain (triple shadowing)
fn shadowing_triple():
    let x = 1

    if true:
        let x = 2

        if true:
            let x = 3

            if true:
                let x = 4
                print(x)    // refers to x = 4

            print(x)   // refers to x = 3

        print(x)   // refers to x = 2

    print(x)   // refers to x = 1

// Shadowing in nested loops
fn loop_shadowing():
    let x = 10

    for i in range(5):
        let x = i * 2

        while x > 0:
            let x = x - 1
            print(x)

        print(x)   // refers to x = i * 2

    print(x)   // refers to x = 10

// Complex if-elif-else scopes
fn complex_if_elif():
    let status = 1

    if status == 1:
        let message = "one"
        print(message)
    elif status == 2:
        let message = "two"
        print(message)
    elif status == 3:
        let message = "three"
        print(message)
    else:
        let message = "other"
        print(message)

// Nested function scopes
fn nested_functions():
    let outer_var = 100

    fn inner():
        let inner_var = 200

        fn deep_inner():
            let deep_var = 300
            return outer_var + inner_var + deep_var

        return deep_inner()

    return inner()

// Loop variable reuse
fn reuse_loop_var():
    for i in range(5):
        let x = i
        print(x)

    for i in range(10, 15):
        let x = i * 2
        print(x)

// Conditional variable definition scope
fn conditional_defs():
    if true:
        let conditional_true = 1
    else:
        let conditional_false = 2

    // Both variables out of scope here

// Multiple scope exit points
fn multi_exit():
    let used1 = 1
    let used2 = 2

    if used1 > 0:
        let scoped1 = 10

        while scoped1 > 0:
            let scoped2 = 20
            return used1 + used2 + scoped1 + scoped2

        return used1 + used2 + scoped1

    return used1 + used2

// Scope with all variables used
fn all_used_vars():
    let a = 1
    let b = 2

    if a > 0:
        let c = 3

        while b < 10:
            let d = 4
            b = b + d
            a = a + c

    return a + b

// Scope with mixed usage
fn mixed_usage():
    let a = 1
    let b = 2     // WARNING: unused
    let c = 3

    if a > 0:
        let d = 4  // WARNING: unused
        let e = 5

        print(a)
        print(c)
        print(e)

    return a + c

// Deep nesting with variable propagation
fn deep_propagation():
    let level1 = 1

    if true:
        let level2 = level1 + 1

        if true:
            let level3 = level2 + 1

            if true:
                let level4 = level3 + 1

                if true:
                    let level5 = level4 + 1
                    print(level1 + level2 + level3 + level4 + level5)

// Shadowing in loop with condition
fn shadow_loop_condition():
    let x = 10

    for i in range(5):
        let x = i

        if x > 2:
            let x = x * 2
            print(x)

        print(x)   // refers to x = i
