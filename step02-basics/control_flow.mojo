fn check_positive(x: Int) -> String:
    if x > 0:
        return "양수"
    elif x < 0:
        return "음수"
    else:
        return "영"

fn get_day_name(day: Int) -> String:
    return match day {
        1 { "월요일" }
        2 { "화요일" }
        3 { "수요일" }
        4 { "목요일" }
        5 { "금요일" }
        6 { "토요일" }
        7 { "일요일" }
        else { "잘못된 날짜" }
    }

fn get_grade(score: Int) -> String:
    return match score / 10 {
        10 { "A+" }
        9 { "A" }
        8 { "B" }
        7 { "C" }
        6 { "D" }
        else { "F" }
    }

fn main():
    print("=== if-else 문 ===")
    let num1 = 5
    let num2 = -3
    let num3 = 0

    print("check_positive(" + str(num1) + ") = " + check_positive(num1))
    print("check_positive(" + str(num2) + ") = " + check_positive(num2))
    print("check_positive(" + str(num3) + ") = " + check_positive(num3))
    print("")

    # 중첩 if-else
    print("=== 중첩 if-else ===")
    let age = 25
    let income = 50000

    if age >= 18:
        if income >= 30000:
            print("성인이며 충분한 소득이 있습니다")
        else:
            print("성인이지만 소득이 부족합니다")
    else:
        print("미성년자입니다")
    print("")

    # match 표현식
    print("=== match 표현식 (패턴 매칭) ===")
    let day = 3
    print("요일: " + get_day_name(day))
    print("")

    let monday = 1
    let friday = 5
    let saturday = 6

    print(str(monday) + "요일은 " + get_day_name(monday))
    print(str(friday) + "요일은 " + get_day_name(friday))
    print(str(saturday) + "요일은 " + get_day_name(saturday))
    print("")

    # 학점 판정
    print("=== 학점 판정 ===")
    let score1 = 95
    let score2 = 87
    let score3 = 72

    print("점수 " + str(score1) + " → 학점: " + get_grade(score1))
    print("점수 " + str(score2) + " → 학점: " + get_grade(score2))
    print("점수 " + str(score3) + " → 학점: " + get_grade(score3))
    print("")

    # 논리 연산자
    print("=== 논리 연산자 ===")
    let x = 10
    let y = 20

    if x > 5 and y > 15:
        print("x > 5 AND y > 15: true")
    else:
        print("x > 5 AND y > 15: false")

    if x > 15 or y > 15:
        print("x > 15 OR y > 15: true")
    else:
        print("x > 15 OR y > 15: false")

    if not (x > 15):
        print("NOT (x > 15): true")
    else:
        print("NOT (x > 15): false")
