fn greet(name: String) -> String:
    return "Hello, " + name + "!"

fn add(a: Int, b: Int) -> Int:
    return a + b

fn main():
    message = greet("Mojo World")
    print(message)

    result = add(5, 3)
    print("5 + 3 = " + str(result))
