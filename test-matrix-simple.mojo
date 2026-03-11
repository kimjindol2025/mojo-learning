fn matrix_multiply_naive(a: List, b: List, m: Int, n: Int, p: Int) -> List:
    var c = []
    for i in range(m):
        for j in range(p):
            var sum_val = 0
            for k in range(n):
                sum_val += a[i * n + k] * b[k * p + j]
            c.append(sum_val)
    return c

fn main():
    print("Hello")
