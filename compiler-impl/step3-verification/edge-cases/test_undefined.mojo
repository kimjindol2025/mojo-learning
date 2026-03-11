// Test case: Undefined Variable Detection
// Tests: single undefined, multiple undefined, undefined in nested scope, undefined function call, mixed

// Single undefined variable
fn test_single_undefined():
    print(undefined_var)  // ERROR: undefined_var not defined

// Multiple undefined variables
fn test_multiple_undefined():
    let x = undefined_a + undefined_b  // ERROR: both undefined
    let y = undefined_c
    return x

// Undefined in nested scope
fn test_nested_undefined():
    let a = 1

    if a > 0:
        let b = undefined_nested  // ERROR: undefined_nested not defined
        return b

    return a

// Undefined function call
fn test_undefined_call():
    return undefined_function()  // ERROR: undefined_function not defined

// Mix of defined and undefined
fn test_mixed():
    let x = 1      // defined
    let y = x + 2  // OK
    let z = y + undefined_z  // ERROR: undefined_z not defined
    return z

// Using variable before definition
fn test_forward_use():
    print(not_yet_defined)  // ERROR: not_yet_defined not defined
    let not_yet_defined = 10

// Undefined in expression
fn test_expr_undefined():
    let arr = []
    let val = arr[undefined_idx]  // ERROR: undefined_idx not defined

// Undefined in function call args
fn test_call_undefined():
    print(undefined_arg1, undefined_arg2)  // ERROR: both undefined
