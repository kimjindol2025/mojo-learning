// Test case: Scope Management
// Tests: variable shadowing, nested scopes, forward references, parameter masking

// Global scope
let global_x: Int = 10

// Function with shadowed variable
fn shadow_test(x: Int) -> Int:
    // x is parameter, shadows global_x
    let x = 20  // Redefine x in local scope (should warn about unused parameter)
    return x

// Function with nested scopes
fn nested_scopes() -> Int:
    let a = 1

    if a > 0:
        let b = 2
        if b > 1:
            let c = 3
            return c
        // c is out of scope here

    // b is out of scope here
    return a

// Function with forward reference
fn caller() -> Int:
    return callee() + 1

fn callee() -> Int:
    return 42

// Function with unused parameter
fn unused_param(unused: Int) -> Int:
    return 100

// Multiple scope levels
fn complex_scopes():
    let outer = 1

    if true:
        let middle = outer + 1

        while middle < 10:
            let inner = middle + 1
            print(inner)
            break

        // inner is out of scope

    // middle is out of scope
