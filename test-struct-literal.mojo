struct Point:
    var x: Float64
    var y: Float64

fn test():
    let p = Point {
        x: 1.0,
        y: 2.0
    }
    print(p)

fn main():
    test()
