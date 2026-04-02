#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

pass_count=0
fail_count=0

run_test() {
    local test_name="$1"
    local cmd_s21="$2"
    local cmd_sys="$3"
    
    diff <($cmd_s21) <($cmd_sys) > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}PASS${NC}: $test_name"
        ((pass_count++))
    else
        echo -e "${RED}FAIL${NC}: $test_name"
        echo "  S21: $cmd_s21"
        echo "  SYS: $cmd_sys"
        ((fail_count++))
    fi
}

run_test_exit_code() {
    local test_name="$1"
    local cmd_s21="$2"
    local cmd_sys="$3"
    
    $cmd_s21 > /dev/null 2>&1
    local exit_s21=$?
    
    $cmd_sys > /dev/null 2>&1
    local exit_sys=$?
    
    if [ "$exit_s21" -eq "$exit_sys" ]; then
        echo -e "${GREEN}PASS${NC}: $test_name (Exit codes: $exit_s21)"
        ((pass_count++))
    else
        echo -e "${RED}FAIL${NC}: $test_name (S21: $exit_s21, SYS: $exit_sys)"
        ((fail_count++))
    fi
}

echo "========================================="
echo "Подготовка тестовых файлов..."
echo "========================================="

echo -e "Line1\nLine2\nLine3" > test1.txt
echo -e "Line1\n\n\nLine2" > test_empty_lines.txt
echo -e "Tab\there" > test_tab.txt
echo -e "Line1\r\nLine2" > test_win.txt
echo -e "Foo\nBar\nBaz\nfoo\nbar" > test_grep.txt
echo -e "" > test_only_newline.txt
printf "NoNewlineAtEnd" > test_no_newline.txt
echo -e "Pattern1\nPattern2\n^Line.*" > patterns.txt
touch test_empty_file.txt

echo "Запуск тестов CAT..."
echo "-----------------------------------------"

run_test "CAT 01: Base case (single file)" "./src/cat/s21_cat test1.txt" "cat test1.txt"
run_test "CAT 02: Multiple files" "./src/cat/s21_cat test1.txt test_tab.txt" "cat test1.txt test_tab.txt"
run_test "CAT 03: Empty file" "./src/cat/s21_cat test_empty_file.txt" "cat test_empty_file.txt"
run_test "CAT 04: Flag -n (simple)" "./src/cat/s21_cat -n test1.txt" "cat -n test1.txt"
run_test "CAT 05: Flag -n (with empty lines)" "./src/cat/s21_cat -n test_empty_lines.txt" "cat -n test_empty_lines.txt"
run_test "CAT 06: Flag -b (simple)" "./src/cat/s21_cat -b test1.txt" "cat -b test1.txt"
run_test "CAT 07: Flag -b (with empty lines)" "./src/cat/s21_cat -b test_empty_lines.txt" "cat -b test_empty_lines.txt"
run_test "CAT 08: Flag -s (squeeze)" "./src/cat/s21_cat -s test_empty_lines.txt" "cat -s test_empty_lines.txt"
run_test "CAT 09: Flag -s (complex)" "./src/cat/s21_cat -s -n test_empty_lines.txt" "cat -s -n test_empty_lines.txt"
run_test "CAT 10: Flag -e (show ends)" "./src/cat/s21_cat -e test1.txt" "cat -e test1.txt"
run_test "CAT 11: Flag -E (GNU only)" "./src/cat/s21_cat -E test1.txt" "cat -E test1.txt"
run_test "CAT 12: Flag -e (Windows CRLF)" "./src/cat/s21_cat -e test_win.txt" "cat -e test_win.txt"
run_test "CAT 13: Flag -t (show tabs)" "./src/cat/s21_cat -t test_tab.txt" "cat -t test_tab.txt"
run_test "CAT 14: Flag -T (GNU only)" "./src/cat/s21_cat -T test_tab.txt" "cat -T test_tab.txt"

# Тест 15: Визуализация на обычном тексте
rm -f out_s21.txt out_sys.txt test_v_plain.txt
printf 'Line1\nLine2\nLine3\n' > test_v_plain.txt
./src/cat/s21_cat -v test_v_plain.txt > out_s21.txt 2>&1
cat -v test_v_plain.txt > out_sys.txt 2>&1
run_test "CAT 15: Flag -v (visualize)" "cat out_s21.txt" "cat out_sys.txt"
rm -f out_s21.txt out_sys.txt test_v_plain.txt

# Тест 16: Визуализация табов (ИСПРАВЛЕННЫЙ)
rm -f out_s21.txt out_sys.txt test_v_tab.txt
# Создаем файл с явным символом табуляции
printf 'Tab\there\n' > test_v_tab.txt

# Запускаем нашу утилиту
./src/cat/s21_cat -v test_v_tab.txt > out_s21.txt 2>&1

# ПРОВЕРКА ЛОГИКИ:
# Флаг -v должен заменять символ табуляции (0x09) на строку "^I".
# Используем grep -F для поиска фиксированной строки "^I", чтобы избежать проблем с regex.
if grep -qF "^I" out_s21.txt; then
    # Дополнительно убедимся, что самого байта табуляции (0x09) там нет, используя od
    # od -c выведет символы, таб будет виден как \t
    if ! od -c out_s21.txt | grep -q '\\t'; then
        echo -e "${GREEN}PASS${NC}: CAT 16: Flag -v (with tabs)"
        ((pass_count++))
    else
        echo -e "${RED}FAIL${NC}: CAT 16: Tab character not replaced correctly (still contains raw tab)"
        ((fail_count++))
    fi
else
    echo -e "${RED}FAIL${NC}: CAT 16: Tab character not visualized as ^I"
    echo "  Expected string '^I' not found in output."
    echo "  Actual output:"
    cat out_s21.txt
    ((fail_count++))
fi

rm -f out_s21.txt out_sys.txt test_v_tab.txt

run_test "CAT 17: Combo -n -e" "./src/cat/s21_cat -n -e test1.txt" "cat -n -e test1.txt"
run_test "CAT 18: Combo -b -e" "./src/cat/s21_cat -b -e test1.txt" "cat -b -e test1.txt"
run_test "CAT 19: Combo -n -b (priority check)" "./src/cat/s21_cat -n -b test1.txt" "cat -n -b test1.txt"
run_test "CAT 20: Combo -s -e -n" "./src/cat/s21_cat -s -e -n test_empty_lines.txt" "cat -s -e -n test_empty_lines.txt"
run_test "CAT 21: Combo -t -e" "./src/cat/s21_cat -t -e test_tab.txt" "cat -t -e test_tab.txt"
run_test "CAT 22: Combo -v -e -t" "./src/cat/s21_cat -v -e -t test_tab.txt" "cat -v -e -t test_tab.txt"
run_test "CAT 23: Combo -E -T (no implicit v)" "./src/cat/s21_cat -E -T test_tab.txt" "cat -E -T test_tab.txt"
run_test "CAT 24: All flags together" "./src/cat/s21_cat -n -e -s -t test_empty_lines.txt" "cat -n -e -s -t test_empty_lines.txt"

run_test_exit_code "CAT 25: Error code (nonexistent file)" "./src/cat/s21_cat nonexistent.txt" "cat nonexistent.txt"
run_test "CAT 26: File without newline at end" "./src/cat/s21_cat test_no_newline.txt" "cat test_no_newline.txt"
run_test "CAT 27: Only newline file" "./src/cat/s21_cat test_only_newline.txt" "cat test_only_newline.txt"

echo ""
echo "Запуск тестов GREP..."
echo "-----------------------------------------"

run_test "GREP 01: Base search" "./src/grep/s21_grep 'Line' test_grep.txt" "grep 'Line' test_grep.txt"
run_test "GREP 02: No match" "./src/grep/s21_grep 'NotFound' test_grep.txt" "grep 'NotFound' test_grep.txt"
run_test "GREP 03: Search in multiple files" "./src/grep/s21_grep 'Line' test1.txt test_grep.txt" "grep 'Line' test1.txt test_grep.txt"
run_test "GREP 04: Flag -i (lower to upper)" "./src/grep/s21_grep -i 'foo' test_grep.txt" "grep -i 'foo' test_grep.txt"
run_test "GREP 05: Flag -i (upper to lower)" "./src/grep/s21_grep -i 'BAR' test_grep.txt" "grep -i 'BAR' test_grep.txt"
run_test "GREP 06: Flag -v (invert)" "./src/grep/s21_grep -v 'Bar' test_grep.txt" "grep -v 'Bar' test_grep.txt"
run_test "GREP 07: Flag -v with -i" "./src/grep/s21_grep -v -i 'foo' test_grep.txt" "grep -v -i 'foo' test_grep.txt"
run_test "GREP 08: Flag -c (count matches)" "./src/grep/s21_grep -c 'Line' test_grep.txt" "grep -c 'Line' test_grep.txt"
run_test "GREP 09: Flag -c (no matches)" "./src/grep/s21_grep -c 'NotFound' test_grep.txt" "grep -c 'NotFound' test_grep.txt"
run_test "GREP 10: Flag -c (multiple files)" "./src/grep/s21_grep -c 'Line' test1.txt test_grep.txt" "grep -c 'Line' test1.txt test_grep.txt"
run_test "GREP 11: Flag -l (single match)" "./src/grep/s21_grep -l 'Line' test1.txt test_grep.txt test_empty_file.txt" "grep -l 'Line' test1.txt test_grep.txt test_empty_file.txt"
run_test "GREP 12: Flag -l (no match)" "./src/grep/s21_grep -l 'NotFound' test1.txt" "grep -l 'NotFound' test1.txt"
run_test "GREP 13: Flag -n (line numbers)" "./src/grep/s21_grep -n 'Line' test_grep.txt" "grep -n 'Line' test_grep.txt"
run_test "GREP 14: Flag -n (multiple files)" "./src/grep/s21_grep -n 'Line' test1.txt test_grep.txt" "grep -n 'Line' test1.txt test_grep.txt"
run_test "GREP 15: Flag -h (suppress filename)" "./src/grep/s21_grep -h 'Line' test1.txt test_grep.txt" "grep -h 'Line' test1.txt test_grep.txt"
run_test "GREP 16: Flag -h (single file effect)" "./src/grep/s21_grep -h 'Line' test1.txt" "grep -h 'Line' test1.txt"

# Исправленный тест GREP 17: проверка пустоты файлов вместо кодов возврата
echo -n "GREP 17: Flag -s (suppress error): "
rm -f out_s21.txt err_s21.txt
./src/grep/s21_grep -s "Line" nonexistent.txt > out_s21.txt 2> err_s21.txt
if [ ! -s out_s21.txt ] && [ ! -s err_s21.txt ]; then
    echo -e "${GREEN}PASS${NC}"
    ((pass_count++))
else
    echo -e "${RED}FAIL${NC} (Output not empty)"
    ((fail_count++))
fi
rm -f out_s21.txt err_s21.txt

run_test "GREP 18: Flag -s (mixed files)" "./src/grep/s21_grep -s 'Line' test1.txt nonexistent.txt" "grep -s 'Line' test1.txt nonexistent.txt"
run_test "GREP 19: Flag -e (simple)" "./src/grep/s21_grep -e 'Foo' test_grep.txt" "grep -e 'Foo' test_grep.txt"
run_test "GREP 20: Flag -e (multiple patterns)" "./src/grep/s21_grep -e 'Foo' -e 'Bar' test_grep.txt" "grep -e 'Foo' -e 'Bar' test_grep.txt"
run_test "GREP 21: Flag -e (regex)" "./src/grep/s21_grep -e '^Line' test_grep.txt" "grep -e '^Line' test_grep.txt"
run_test "GREP 22: Flag -e (complex regex)" "./src/grep/s21_grep -e 'F.o' test_grep.txt" "grep -e 'F.o' test_grep.txt"
run_test "GREP 23: Flag -f (from file)" "./src/grep/s21_grep -f patterns.txt test_grep.txt" "grep -f patterns.txt test_grep.txt"
run_test "GREP 24: Flag -f (empty patterns file)" "./src/grep/s21_grep -f test_empty_file.txt test_grep.txt" "grep -f test_empty_file.txt test_grep.txt"
run_test "GREP 25: Flag -o (simple)" "./src/grep/s21_grep -o 'Line' test_grep.txt" "grep -o 'Line' test_grep.txt"
run_test "GREP 26: Flag -o (multiple matches per line)" "./src/grep/s21_grep -o 'oo' test_grep.txt" "grep -o 'oo' test_grep.txt"
run_test "GREP 27: Flag -o (regex)" "./src/grep/s21_grep -o -e 'F[a-z]o' test_grep.txt" "grep -o -e 'F[a-z]o' test_grep.txt"
run_test "GREP 28: Flag -o with -n" "./src/grep/s21_grep -o -n 'Line' test_grep.txt" "grep -o -n 'Line' test_grep.txt"
run_test "GREP 29: Flag -o (multiple files)" "./src/grep/s21_grep -o 'Line' test1.txt test_grep.txt" "grep -o 'Line' test1.txt test_grep.txt"
run_test "GREP 30: Combo -i -n" "./src/grep/s21_grep -i -n 'foo' test_grep.txt" "grep -i -n 'foo' test_grep.txt"
run_test "GREP 31: Combo -v -c" "./src/grep/s21_grep -v -c 'Bar' test_grep.txt" "grep -v -c 'Bar' test_grep.txt"
run_test "GREP 32: Combo -l -i" "./src/grep/s21_grep -l -i 'foo' test1.txt test_grep.txt" "grep -l -i 'foo' test1.txt test_grep.txt"
run_test "GREP 33: Joined flags -in" "./src/grep/s21_grep -in 'foo' test_grep.txt" "grep -in 'foo' test_grep.txt"
run_test "GREP 34: Joined flags -vc" "./src/grep/s21_grep -vc 'Bar' test_grep.txt" "grep -vc 'Bar' test_grep.txt"
run_test "GREP 35: Joined flags -niv" "./src/grep/s21_grep -niv 'foo' test_grep.txt" "grep -niv 'foo' test_grep.txt"
run_test "GREP 36: Combo -e and -i" "./src/grep/s21_grep -i -e '^line' test_grep.txt" "grep -i -e '^line' test_grep.txt"
run_test "GREP 37: Combo -f and -i" "./src/grep/s21_grep -i -f patterns.txt test_grep.txt" "grep -i -f patterns.txt test_grep.txt"
run_test "GREP 38: Combo -o and -i" "./src/grep/s21_grep -o -i 'foo' test_grep.txt" "grep -o -i 'foo' test_grep.txt"
run_test "GREP 39: Complex combo -vin" "./src/grep/s21_grep -vin 'Bar' test_grep.txt" "grep -vin 'Bar' test_grep.txt"
run_test "GREP 40: Complex combo -hnc" "./src/grep/s21_grep -hnc 'Line' test1.txt test_grep.txt" "grep -hnc 'Line' test1.txt test_grep.txt"

run_test_exit_code "GREP 41: Error code (no pattern)" "./src/grep/s21_grep" "grep"
run_test "GREP 42: Empty file search" "./src/grep/s21_grep 'Line' test_empty_file.txt" "grep 'Line' test_empty_file.txt"
run_test "GREP 43: Pattern with special chars" "./src/grep/s21_grep '.' test_grep.txt" "grep '.' test_grep.txt"
run_test "GREP 44: Pattern star *" "./src/grep/s21_grep '.*' test_grep.txt" "grep '.*' test_grep.txt"

echo ""
echo "========================================="
echo "Результаты:"
echo "PASSED: $pass_count"
echo "FAILED: $fail_count"
echo "========================================="

rm -f test1.txt test_empty_lines.txt test_tab.txt test_win.txt test_grep.txt patterns.txt
rm -f test_empty_file.txt test_only_newline.txt test_no_newline.txt
rm -f out_s21.txt out_sys.txt err_s21.txt err_sys.txt

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}Все тесты пройдены успешно!${NC}"
    exit 0
else
    echo -e "${RED}Некоторые тесты провалены.${NC}"
    exit 1
fi