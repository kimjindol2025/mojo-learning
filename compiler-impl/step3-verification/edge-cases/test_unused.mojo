// Test case: Unused Variable Detection
// Tests: single unused, multiple unused, unused parameters, used in if/while but not after, intentional unused

// Single unused variable
fn test_single_unused():
    let x = 1  // WARNING: unused
    let y = 2
    return y

// Multiple unused variables
fn test_multiple_unused():
    let a = 1  // WARNING: unused
    let b = 2  // WARNING: unused
    let c = 3
    return c

// Unused parameters
fn test_unused_param(unused1: Int, unused2: Int, used: Int) -> Int:
    // WARNING: unused1, unused2 not used
    return used * 2

// Used inside if but not after
fn test_used_in_if():
    let x = 1

    if true:
        let y = 2  // WARNING: only used in this block
        print(y)

    // x is still used (implicitly marked as used)
    return x

// Used inside while but not after
fn test_used_in_while():
    let count = 0

    while count < 10:
        let temp = count * 2  // WARNING: only used in loop
        print(temp)
        count = count + 1

    return count

// Intentionally unused (should still warn)
fn test_many_unused():
    let a = 1  // WARNING: unused
    let b = 2  // WARNING: unused
    let c = 3  // WARNING: unused
    let d = 4  // WARNING: unused

    return 0

// Partially used variables
fn test_partial_use():
    let x = 1  // WARNING: only defined, not really used
    let y = 2
    let z = x  // x is used here
    let result = y + z
    return result

// Unused in function body
fn test_func_body_unused():
    let x = 10
    let y = 20
    let z = 30  // WARNING: unused

    fn inner() -> Int:
        return x + y  // outer x and y are used

    return inner()
