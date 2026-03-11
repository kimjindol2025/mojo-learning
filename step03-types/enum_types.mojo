fn http_status_text(code: Int) -> String:
    return match code {
        200 { "OK" }
        201 { "Created" }
        204 { "No Content" }
        301 { "Moved Permanently" }
        304 { "Not Modified" }
        400 { "Bad Request" }
        401 { "Unauthorized" }
        403 { "Forbidden" }
        404 { "Not Found" }
        500 { "Internal Server Error" }
        502 { "Bad Gateway" }
        503 { "Service Unavailable" }
        else { "Unknown Status" }
    }

fn http_status_category(code: Int) -> String:
    return match code / 100 {
        2 { "Success" }
        3 { "Redirection" }
        4 { "Client Error" }
        5 { "Server Error" }
        else { "Unknown" }
    }

fn day_name(day: Int) -> String:
    return match day {
        1 { "Monday" }
        2 { "Tuesday" }
        3 { "Wednesday" }
        4 { "Thursday" }
        5 { "Friday" }
        6 { "Saturday" }
        7 { "Sunday" }
        else { "Invalid day" }
    }

fn color_to_hex(color: String) -> String:
    return match color {
        "red" { "#FF0000" }
        "green" { "#00FF00" }
        "blue" { "#0000FF" }
        "black" { "#000000" }
        "white" { "#FFFFFF" }
        else { "#CCCCCC" }
    }

fn operation_symbol(op: String) -> String:
    return match op {
        "add" { "+" }
        "subtract" { "-" }
        "multiply" { "*" }
        "divide" { "/" }
        else { "?" }
    }

fn calculate(a: Int, b: Int, op: String) -> String:
    let result = match op {
        "add" { a + b }
        "subtract" { a - b }
        "multiply" { a * b }
        "divide" { a / b }
        else { 0 }
    }

    return str(a) + " " + operation_symbol(op) + " " + str(b) + " = " + str(result)

fn main():
    print("=== Enum/Sum 타입 (패턴 매칭) ===")
    print("")

    # 1. HTTP 상태 코드
    print("--- HTTP 상태 코드 ---")
    print("200: " + http_status_text(200))
    print("404: " + http_status_text(404))
    print("500: " + http_status_text(500))
    print("999: " + http_status_text(999))
    print("")

    # 2. HTTP 상태 분류
    print("--- HTTP 상태 분류 ---")
    print("200 범주: " + http_status_category(200))
    print("301 범주: " + http_status_category(301))
    print("404 범주: " + http_status_category(404))
    print("500 범주: " + http_status_category(500))
    print("")

    # 3. 요일 변환
    print("--- 요일 변환 ---")
    for day in range(1, 8):
        print(str(day) + ": " + day_name(day))
    print("")

    # 4. 색상 코드 변환
    print("--- 색상 코드 변환 ---")
    let colors = ["red", "green", "blue", "black", "white", "purple"]
    for color in colors:
        print(color + " = " + color_to_hex(color))
    print("")

    # 5. 계산 연산자
    print("--- 계산 연산자 ---")
    print(calculate(10, 5, "add"))
    print(calculate(10, 5, "subtract"))
    print(calculate(10, 5, "multiply"))
    print(calculate(10, 5, "divide"))
    print(calculate(10, 0, "divide"))
    print("")

    # 6. Result 패턴 (성공/실패)
    print("=== Result 패턴 ===")
    let valid_result = calculate(20, 4, "divide")
    let error_result = calculate(20, 0, "divide")

    print("성공 케이스: " + valid_result)
    print("실패 케이스: " + error_result)
    print("")

    # 7. Enum의 이점
    print("=== Enum 타입의 이점 ===")
    print("✓ 유한한 경우의 수 표현")
    print("✓ 패턴 매칭으로 안전한 처리")
    print("✓ 모든 케이스 처리 강제 (완전성)")
    print("✓ 타입 안전성")
    print("✓ 코드 가독성 향상")
