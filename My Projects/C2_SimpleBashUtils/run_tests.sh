#!/bin/bash

echo "========================================="
echo "Подготовка тестовых файлов..."
echo "========================================="

# Создание тестовых файлов
echo -e "Line1\nLine2\nLine3" > test1.txt
echo -e "Line1\n\n\nLine2" > test_empty.txt
echo -e "Tab\there" > test_tab.txt
echo -e "Line1\r\nLine2" > test_win.txt
echo -e "Foo\nBar\nBaz" > test_grep.txt
echo -e "Pattern1\nPattern2" > patterns.txt

echo "Запуск тестов CAT..."
echo "-----------------------------------------"

# Тесты CAT
diff <(./src/cat/s21_cat test1.txt) <(cat test1.txt) && echo "CAT 1 (Base): PASS" || echo "CAT 1 (Base): FAIL"
diff <(./src/cat/s21_cat -n test1.txt) <(cat -n test1.txt) && echo "CAT 2 (-n): PASS" || echo "CAT 2 (-n): FAIL"
diff <(./src/cat/s21_cat -b test1.txt) <(cat -b test1.txt) && echo "CAT 3 (-b): PASS" || echo "CAT 3 (-b): FAIL"
diff <(./src/cat/s21_cat -n -b test1.txt) <(cat -n -b test1.txt) && echo "CAT 4 (-n -b): PASS" || echo "CAT 4 (-n -b): FAIL"
diff <(./src/cat/s21_cat -s test_empty.txt) <(cat -s test_empty.txt) && echo "CAT 5 (-s): PASS" || echo "CAT 5 (-s): FAIL"
diff <(./src/cat/s21_cat -e test1.txt) <(cat -e test1.txt) && echo "CAT 6 (-e): PASS" || echo "CAT 6 (-e): FAIL"
diff <(./src/cat/s21_cat -E test1.txt) <(cat -E test1.txt) && echo "CAT 7 (-E): PASS" || echo "CAT 7 (-E): FAIL"
diff <(./src/cat/s21_cat -t test_tab.txt) <(cat -t test_tab.txt) && echo "CAT 8 (-t): PASS" || echo "CAT 8 (-t): FAIL"
diff <(./src/cat/s21_cat -T test_tab.txt) <(cat -T test_tab.txt) && echo "CAT 9 (-T): PASS" || echo "CAT 9 (-T): FAIL"
# Тест -v сложен для сравнения diff из-за непечатных символов в выводе diff, проверяем визуально или через hexdump, но здесь упростим
./src/cat/s21_cat -v test1.txt > out_s21.txt && cat -v test1.txt > out_sys.txt && diff out_s21.txt out_sys.txt && echo "CAT 10 (-v): PASS" || echo "CAT 10 (-v): FAIL"
rm -f out_s21.txt out_sys.txt

diff <(./src/cat/s21_cat -n -e -s test_empty.txt) <(cat -n -e -s test_empty.txt) && echo "CAT 11 (Combo): PASS" || echo "CAT 11 (Combo): FAIL"
diff <(./src/cat/s21_cat test1.txt test_empty.txt) <(cat test1.txt test_empty.txt) && echo "CAT 12 (Multi-file): PASS" || echo "CAT 12 (Multi-file): FAIL"

# Тест ошибки (сравниваем коды возврата)
./src/cat/s21_cat nonexistent.txt > /dev/null 2>&1
EXIT_S21=$?
cat nonexistent.txt > /dev/null 2>&1
EXIT_SYS=$?
if [ "$EXIT_S21" -eq "$EXIT_SYS" ]; then echo "CAT 13 (Error code): PASS"; else echo "CAT 13 (Error code): FAIL"; fi

echo ""
echo "Запуск тестов GREP..."
echo "-----------------------------------------"

# Тесты GREP
diff <(./src/grep/s21_grep "Line1" test_grep.txt) <(grep "Line1" test_grep.txt) && echo "GREP 1 (Base): PASS" || echo "GREP 1 (Base): FAIL"
diff <(./src/grep/s21_grep -i "line1" test_grep.txt) <(grep -i "line1" test_grep.txt) && echo "GREP 2 (-i): PASS" || echo "GREP 2 (-i): FAIL"
diff <(./src/grep/s21_grep -v "Line1" test_grep.txt) <(grep -v "Line1" test_grep.txt) && echo "GREP 3 (-v): PASS" || echo "GREP 3 (-v): FAIL"
diff <(./src/grep/s21_grep -c "Line" test_grep.txt) <(grep -c "Line" test_grep.txt) && echo "GREP 4 (-c): PASS" || echo "GREP 4 (-c): FAIL"
diff <(./src/grep/s21_grep -n "Line" test_grep.txt) <(grep -n "Line" test_grep.txt) && echo "GREP 5 (-n): PASS" || echo "GREP 5 (-n): FAIL"
diff <(./src/grep/s21_grep -l "Line" test1.txt test_empty.txt) <(grep -l "Line" test1.txt test_empty.txt) && echo "GREP 6 (-l): PASS" || echo "GREP 6 (-l): FAIL"
diff <(./src/grep/s21_grep -h "Line" test1.txt test_empty.txt) <(grep -h "Line" test1.txt test_empty.txt) && echo "GREP 7 (-h): PASS" || echo "GREP 7 (-h): FAIL"

# Тест -s (подавление ошибок)
./src/grep/s21_grep -s "Line" nonexistent.txt > out_s21.txt 2> err_s21.txt
grep -s "Line" nonexistent.txt > out_sys.txt 2> err_sys.txt
if [ ! -s out_s21.txt ] && [ ! -s err_s21.txt ]; then echo "GREP 8 (-s): PASS"; else echo "GREP 8 (-s): FAIL"; fi
rm -f out_s21.txt err_s21.txt out_sys.txt err_sys.txt

# Тест нескольких паттернов -e
diff <(./src/grep/s21_grep -e "^Line" -e "Bar" test_grep.txt) <(grep -e "^Line" -e "Bar" test_grep.txt) && echo "GREP 9 (-e x2): PASS" || echo "GREP 9 (-e x2): FAIL"

diff <(./src/grep/s21_grep -o "Line" test_grep.txt) <(grep -o "Line" test_grep.txt) && echo "GREP 10 (-o): PASS" || echo "GREP 10 (-o): FAIL"
diff <(./src/grep/s21_grep -i -n -v "foo" test_grep.txt) <(grep -i -n -v "foo" test_grep.txt) && echo "GREP 11 (Combo): PASS" || echo "GREP 11 (Combo): FAIL"

# Несколько файлов
diff <(./src/grep/s21_grep "Line" test1.txt test_empty.txt) <(grep "Line" test1.txt test_empty.txt) && echo "GREP 12 (Multi-file): PASS" || echo "GREP 12 (Multi-file): FAIL"

# Паттерн из файла
diff <(./src/grep/s21_grep -f patterns.txt test_grep.txt) <(grep -f patterns.txt test_grep.txt) && echo "GREP 13 (-f): PASS" || echo "GREP 13 (-f): FAIL"

# Слитные флаги
diff <(./src/grep/s21_grep -ivn "foo" test_grep.txt) <(grep -ivn "foo" test_grep.txt) && echo "GREP 14 (Joined flags): PASS" || echo "GREP 14 (Joined flags): FAIL"

echo ""
echo "========================================="
echo "Тестирование завершено."
echo "========================================="

# Очистка тестовых файлов
rm -f test1.txt test_empty.txt test_tab.txt test_win.txt test_grep.txt patterns.txt