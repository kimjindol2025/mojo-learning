fn add(a, b) {
    let result = a + b
    return result
}

fn factorial(n) {
    if n <= 1 {
        return 1
    }
    let prev = factorial(n - 1)
    return n * prev
}

fn main() {
    let x = add(3, 4)
    print(x)
    
    let fact5 = factorial(5)
    print(fact5)
}
