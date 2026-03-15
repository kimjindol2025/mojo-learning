// Test case: Error Handling & Recovery
// Tests: multiple errors, error recovery, partial parsing, error accumulation

// Multiple undefined variables
fn multiple_undefined():
    let x = undefined1 + undefined2 + undefined3
    return undefined4

// Mixed defined and undefined
fn mixed_defined_undefined():
    let a = 1
    let b = undefined_b
    let c = a + undefined_c
    return a + b + c

// Nested scope with errors
fn nested_errors():
    if undefined_cond:
        let x = undefined_inner1

        while undefined_inner2:
            let y = undefined_inner3
            return y

    return undefined_outer

// Variable redefinition (multiple times)
fn redefinition_error():
    let x = 1
    let x = 2
    let x = 3
    return x

// Function call with undefined args
fn function_call_error():
    let result = undefined_func(undefined_arg1, undefined_arg2)
    return result + undefined_result

// Multiple unused variables
fn unused_warnings():
    let unused1 = 1
    let unused2 = 2
    let unused3 = 3
    let used = 4
    return used

// Unused parameters
fn unused_param_warning(unused1: Int, unused2: Int, used: Int) -> Int:
    return used

// Error and warning combined
fn mixed_errors_warnings():
    let unused = 1
    let undefined = undefined_var
    let used = 2
    return used + undefined

// Parser continues after error
fn recovery_continues():
    let a = undefined1
    let b = 2
    let c = undefined2
    let d = 4
    return b + d

// Large number of errors
fn mass_errors():
    return (undefined1 + undefined2) * (undefined3 - undefined4)

// Deep scope with errors
fn deep_error_scope():
    let level1 = 1

    if level1 > 0:
        let level2 = undefined_level2

        if level2 > 0:
            let level3 = undefined_level3

            if level3 > 0:
                let level4 = undefined_level4
                return level4

// Function with error in body
fn func_with_error(x: Int) -> Int:
    let y = undefined_in_func
    return x + y

// Loop with errors
fn loop_with_errors():
    for i in range(10):
        let x = undefined_in_loop
        let y = i + x

    return 0

// Multiple redefinitions in different scopes
fn scope_redef():
    let x = 1

    if true:
        let x = 2
        let x = 3

    if true:
        let x = 4
        let x = 5

// Mix of all error types
fn comprehensive_errors():
    let a = 1              // defined, used
    let b = 2              // defined, unused
    let c = undefined_c    // ERROR
    let d = d + 1          // ERROR - use before defined
    let d = 4              // redefine d

    if true:
        let e = undefined_e // ERROR in nested scope
        let f = 10          // unused in scope
        print(a)

    return a + c

// Function overloading with error
fn calc(x: Int) -> Int:
    return x * 2

fn calc(x: String) -> String:
    return x + x

fn call_calc_error():
    let r1 = calc(10)
    let r2 = calc("hello")
    let r3 = calc(undefined_arg)  // ERROR
    return 0

// Conditional with multiple errors
fn conditional_errors():
    if undefined_cond1:
        let x = undefined_x
    elif undefined_cond2:
        let y = undefined_y
    else:
        let z = undefined_z

    return 0

// All possible error combinations
fn all_error_types():
    let defined = 1
    let unused = 2              // WARNING: unused
    let redef = 3
    let redef = 4               // ERROR: redefined
    let undefined_used = undefined  // ERROR: undefined
    return defined + undefined_used
