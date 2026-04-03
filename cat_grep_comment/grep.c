#define _GNU_SOURCE           // Включаем расширения GNU (нужно для функции getline)
#define _POSIX_C_SOURCE 200809L // Включаем стандарт POSIX.1-2008 для переносимости

#include <getopt.h>           // Библиотека для разбора аргументов командной строки (getopt)
#include <regex.h>            // Библиотека для работы с регулярными выражениями (regcomp, regexec)
#include <stdbool.h>          // Тип данных bool (true/false)
#include <stdio.h>            // Стандартный ввод/вывод (printf, fopen, stdin)
#include <stdlib.h>           // Общие функции (malloc, free, realloc, exit)
#include <string.h>           // Работа со строками (strlen, strcat, strdup)

// Структура для хранения всех флагов и данных состояния grep
typedef struct {
  int e;  // Флаг -e: явное указание паттерна (защищает паттерны вида "-foo" от трактовки как флага)
  int i;  // Флаг -i: игнорировать регистр букв (case-insensitive)
  int v;  // Флаг -v: инверсия (выводить строки, которые НЕ совпадают)
  int c;  // Флаг -c: count (выводить только количество совпавших строк)
  int l;  // Флаг -l: list (выводить только имена файлов, где есть совпадения)
  int n;  // Флаг -n: number (выводить номер строки перед совпадением)
  int h;  // Флаг -h: hide (не выводить имя файла при поиске в нескольких файлах)
  int s;  // Флаг -s: silent (подавлять сообщения об ошибках, например "файл не найден")
  int f;  // Флаг -f: file (читать паттерны из указанного файла)
  int o;  // Флаг -o: only-matching (выводить только совпавшую часть строки)
  char *pattern; // Указатель на строку с итоговым паттерном (регулярным выражением)
  regex_t regex; // Скомпилированная структура регулярного выражения (внутренний формат библиотеки)
} GrepFlags;

// Функция освобождения массива строк (паттернов), прочитанных из файла
static void free_lines_array(char **lines, int count) {
  if (lines) { // Если указатель на массив не NULL
    for (int i = 0; i < count; i++) { // Проходим по каждому элементу массива
      if (lines[i]) { // Если сама строка не NULL
        free(lines[i]); // Освобождаем память под строку (была выделена через strdup)
      }
    }
    free(lines); // Освобождаем память под сам массив указателей (была выделена через realloc)
  }
}

// Функция чтения файла построчно в динамический массив строк
// Возвращает код ошибки (0 - успех, 1 - ошибка)
static int read_file_to_array(FILE *fp, char ***out_lines,
                              size_t *out_total_len, int *out_count) {
  char *line = NULL; // Буфер для текущей строки (getline выделит память сам)
  size_t len = 0;    // Размер буфера
  ssize_t read_val;  // Количество прочитанных байт
  char **lines = NULL; // Динамический массив указателей на строки
  int count = 0;     // Количество прочитанных строк
  size_t total_len = 0; // Суммарная длина всех строк (нужна для сборки общего паттерна)
  int error_code = 0; // Код возврата функции
  bool finished = false; // Флаг завершения чтения

  // Читаем файл пока не конец и нет ошибки
  while (!finished && (read_val = getline(&line, &len, fp)) != -1) {
    // Удаляем символ перевода строки '\n' в конце, если он есть
    if (read_val > 0 && line[read_val - 1] == '\n') {
      line[read_val - 1] = '\0'; // Заменяем '\n' на нулевой терминатор
      read_val--; // Уменьшаем длину строки
    }

    // Если строка не пустая (длина > 0)
    if (read_val == 0) {
      // Пустую строку игнорируем (ничего не делаем)
    } else {
      // Увеличиваем размер массива lines на 1 элемент
      char **temp = realloc(lines, (count + 1) * sizeof(char *));
      if (!temp) { // Если realloc не удалось выделить память
        error_code = 1; // Ставим код ошибки
        finished = true; // Прерываем цикл
      } else {
        lines = temp; // Обновляем указатель на новый массив
        lines[count] = strdup(line); // Копируем строку в новую ячейку памяти (strdup делает malloc)
        if (!lines[count]) { // Если strdup не удался
          error_code = 1;
          finished = true;
        } else {
          total_len += strlen(lines[count]); // Добавляем длину новой строки к общей
          if (count > 0) total_len += 1; // Добавляем 1 байт под разделитель '|' (кроме первой строки)
          count++; // Увеличиваем счетчик строк
        }
      }
    }
  }

  free(line); // Освобождаем буфер, выделенный функцией getline

  // Если была ошибка при чтении
  if (error_code != 0) {
    free_lines_array(lines, count); // Очищаем то, что успели выделить
    *out_lines = NULL; // Возвращаем NULL наружу
    *out_total_len = 0;
    *out_count = 0;
  } else {
    // Если всё успешно
    *out_lines = lines; // Передаем массив наружу
    *out_total_len = total_len; // Передаем общую длину
    *out_count = count; // Передаем количество строк
  }

  return error_code;
}

// Функция сборки единого регулярного выражения из множества строк-паттернов
// Паттерны объединяются через '|' (логическое ИЛИ): "pat1|pat2|pat3"
static int build_pattern(char **lines, int count, size_t total_len,
                         char **out_pattern) {
  char *pattern = NULL; // Указатель на итоговую строку паттерна
  int error_code = 0;
  bool success = false;

  pattern = malloc(total_len + 1); // Выделяем память: сумма длин + 1 байт под '\0'
  if (!pattern) { // Если malloc не удался
    error_code = 1;
  } else {
    pattern[0] = '\0'; // Инициализируем строку пустой
    for (int i = 0; i < count; i++) {
      if (i > 0) strcat(pattern, "|"); // Добавляем разделитель '|' перед каждым паттерном, кроме первого
      strcat(pattern, lines[i]); // Добавляем сам паттерн
    }
    success = true;
  }

  if (success) {
    *out_pattern = pattern; // Возвращаем готовый паттерн
  } else {
    *out_pattern = NULL;
    if (pattern) free(pattern); // Освобождаем память при ошибке
  }

  return error_code;
}

// Функция загрузки паттернов из файла (реализация флага -f)
static int load_patterns_from_file(const char *filename, GrepFlags *flags) {
  FILE *fp = NULL;
  char **lines = NULL;
  size_t total_len = 0;
  int count = 0;
  int error_code = 0;
  int read_result = 0;
  int build_result = 0;

  fp = fopen(filename, "r"); // Открываем файл с паттернами
  if (!fp) { // Если файл не открылся
    if (!flags->s) perror(filename); // Если не режим тишины, печатаем ошибку системы
    error_code = 1;
  } else {
    // Читаем все строки из файла в массив
    read_result = read_file_to_array(fp, &lines, &total_len, &count);
    fclose(fp); // Закрываем файл

    if (read_result != 0) { // Если чтение не удалось
      if (!flags->s) error_code = 1;
    } else if (count == 0) { // Если файл пуст или нет-valid строк
      if (!flags->s) fprintf(stderr, "%s: no patterns found\n", filename);
      error_code = 1;
    } else {
      // Собираем единый паттерн из прочитанных строк
      build_result = build_pattern(lines, count, total_len, &flags->pattern);
      free_lines_array(lines, count); // Освобождаем временный массив строк

      if (build_result != 0) { // Если сборка паттерна не удалась
        if (!flags->s)
          fprintf(stderr, "%s: memory allocation failed\n", filename);
        error_code = 1;
      }
    }
  }

  return error_code;
}

// Функция компиляции строки-паттерна во внутренний формат regex
static int compile_regex(GrepFlags *flags) {
  int cflags = REG_EXTENDED; // Флаг: использовать расширенный синтаксис регулярных выражений
  int error_code = 0;

  if (flags->i) cflags |= REG_ICASE; // Если флаг -i, добавляем флаг игнорирования регистра

  if (!flags->pattern) { // Если паттерн не задан
    if (!flags->s) fprintf(stderr, "No pattern provided\n");
    error_code = 1;
  } else {
    // Компилируем паттерн. Если ошибка (возврат != 0)
    if (regcomp(&flags->regex, flags->pattern, cflags) != 0) {
      if (!flags->s) fprintf(stderr, "Invalid regular expression\n");
      error_code = 1;
    }
  }

  return error_code;
}

// Функция вывода только совпавших частей строки (реализация флага -o)
static void print_matches_only(const char *filename, const char *line,
                               int line_num, int files_count,
                               const regex_t *regex, const GrepFlags *flags) {
  regmatch_t pmatch[1]; // Структура для хранения координат совпадения (начало и конец)
  int offset = 0;       // Смещение в строке, с которого начинаем поиск следующего совпадения
  int len = (int)strlen(line); // Длина исходной строки

  // Цикл поиска всех совпадений в строке
  while (regexec(regex, line + offset, 1, pmatch, 0) == 0) {
    // Если нужно вывести имя файла (флаг -h выключен и файлов > 1)
    if (!flags->h && files_count > 1) {
      printf("%s:", filename);
    }
    // Если нужно вывести номер строки (флаг -n)
    if (flags->n) {
      printf("%d:", line_num);
    }
    // Выводим само совпадение используя координаты из pmatch
    fwrite(line + offset + pmatch[0].rm_so, 1,
           pmatch[0].rm_eo - pmatch[0].rm_so, stdout);

    printf("\n"); // Каждое совпадение с новой строки

    offset += pmatch[0].rm_eo; // Сдвигаем offset на конец текущего совпадения

    // Защита от зацикливания: если совпадение пустое (длина 0), сдвигаем на 1 символ
    if (pmatch[0].rm_so == pmatch[0].rm_eo) {
      offset++;
    }
    // Если дошли до конца строки, выходим
    if (offset >= len) {
      break;
    }
  }
}

// Функция вывода всей строки, в которой найдено совпадение
static void print_match_line(const char *filename, const char *line,
                             int line_num, int files_count,
                             const GrepFlags *flags) {
  // Вывод имени файла, если нужно
  if (!flags->h && files_count > 1) {
    printf("%s:", filename);
  }
  // Вывод номера строки, если нужно
  if (flags->n) {
    printf("%d:", line_num);
  }
  // Вывод самой строки
  printf("%s\n", line);
}

// Основная функция обработки одного файла
static int process_single_file(const char *filename, FILE *fp, GrepFlags *flags,
                               int files_count) {
  char *line = NULL; // Буфер для строки
  size_t len = 0;
  ssize_t read_val;
  int line_num = 0; // Счетчик строк в файле
  int match_count = 0; // Счетчик совпадений (для флага -c)
  bool file_matched = false; // Флаг: было ли хоть одно совпадение в файле (для флага -l)
  int error_code = 0;
  bool reading = true; // Флаг продолжения чтения (нужен для раннего выхода при флаге -l)

  // Чтение файла построчно
  while (reading && (read_val = getline(&line, &len, fp)) != -1) {
    line_num++;
    // Удаляем '\n' в конце строки
    if (read_val > 0 && line[read_val - 1] == '\n') {
      line[read_val - 1] = '\0';
    }
    
    // Проверка на совпадение с регулярным выражением
    bool match = (regexec(&flags->regex, line, 0, NULL, 0) == 0);
    
    // Если включен флаг -v (инверсия), меняем результат на противоположный
    if (flags->v) match = !match;

    if (match) { // Если совпадение найдено (с учетом инверсии)
      file_matched = true;
      match_count++;

      if (flags->l) { // Если флаг -l (только имена файлов)
        reading = false; // Прерываем чтение, имя файла уже запомнили
      } else if (!flags->c) { // Если НЕ флаг -c (count), значит нужно выводить строки
        if (flags->o) { // Если флаг -o, выводим только части
          print_matches_only(filename, line, line_num, files_count,
                             &flags->regex, flags);
        } else { // Иначе выводим всю строку
          print_match_line(filename, line, line_num, files_count, flags);
        }
      }
    }
  }

  // Проверка на ошибку чтения файла (не конец файла, а именно ошибка диска/доступа)
  if (ferror(fp)) {
    if (!flags->s) perror(filename);
    error_code = 1;
  }

  free(line); // Освобождаем буфер строки
  
  // Пост-обработка после цикла чтения
  if (flags->l) { // Если флаг -l
    if (file_matched) { // И если совпадение было
      printf("%s\n", filename); // Выводим имя файла
    }
  } else if (flags->c) { // Если флаг -c (count)
    if (!flags->h && files_count > 1) { // Вывод имени файла если нужно
      printf("%s:", filename);
    }
    printf("%d\n", match_count); // Вывод количества совпадений
  }

  return error_code;
}

// Функция разбора аргументов командной строки
static int parse_arguments(int argc, char *argv[], GrepFlags *flags,
                           bool *parse_error) {
  int opt;
  int exit_code = 0;

  // Цикл разбора опций. Строка "e:ivclnhsf:o" означает:
  // e: требует аргумент, f: требует аргумент, остальные - простые флаги
  while ((opt = getopt(argc, argv, "e:ivclnhsf:o")) != -1) {
    switch (opt) {
      case 'e': // Флаг -e (паттерн)
        flags->pattern = optarg; // optarg содержит значение аргумента
        flags->e = 1;
        break;
      case 'i': flags->i = 1; break;
      case 'v': flags->v = 1; break;
      case 'c': flags->c = 1; break;
      case 'l': flags->l = 1; break;
      case 'n': flags->n = 1; break;
      case 'h': flags->h = 1; break;
      case 's': flags->s = 1; break;
      case 'f': // Флаг -f (файл с паттернами)
        if (load_patterns_from_file(optarg, flags) != 0) { // Загружаем паттерны
          exit_code = 1;
          *parse_error = true;
        }
        flags->f = 1;
        break;
      case 'o': flags->o = 1; break;
      default: // Неизвестный флаг
        exit_code = 1;
        *parse_error = true;
        optind = argc; // Принудительно завершаем цикл getopt
        break;
    }
  }

  return exit_code;
}

int main(int argc, char *argv[]) {
  GrepFlags flags = {0}; // Обнуляем структуру флагов
  int exit_code = 0;
  bool parse_error = false;
  bool pattern_missing = false;
  bool compile_error = false;
  int files_count = 0;

  // Этап 1: Разбор аргументов
  exit_code = parse_arguments(argc, argv, &flags, &parse_error);

  if (!parse_error) {
    // Этап 2: Определение паттерна, если он не был задан через -e или -f
    if (!flags.e && !flags.f) {
      if (optind < argc) { // Если есть еще аргументы после флагов
        flags.pattern = argv[optind++]; // Берем первый как паттерн, сдвигаем индекс
      } else {
        // Паттерна нет вообще
        if (!flags.s)
          fprintf(stderr, "Usage: %s [-eivclnhsfo] PATTERN [FILE...]\n", argv[0]);
        exit_code = 1;
        pattern_missing = true;
      }
    }

    // Этап 3: Компиляция регулярного выражения (если паттерн есть и нет ошибок ранее)
    if (!pattern_missing && exit_code == 0) {
      if (compile_regex(&flags) != 0) {
        exit_code = 1;
        compile_error = true;
      }
    }

    // Этап 4: Обработка файлов (если нет ошибок компиляции)
    if (!compile_error && exit_code == 0) {
      files_count = argc - optind; // Количество файлов для обработки
      
      if (files_count == 0) { // Если файлы не указаны, читаем stdin
        process_single_file("(stdin)", stdin, &flags, 1);
      } else {
        // Проходим по всем файлам
        for (int i = optind; i < argc; i++) {
          FILE *fp = fopen(argv[i], "r");
          if (fp == NULL) { // Ошибка открытия файла
            if (!flags.s) perror(argv[i]);
            exit_code = 1;
            continue; // Переходим к следующему файлу
          }
          process_single_file(argv[i], fp, &flags, files_count);
          fclose(fp);
        }
      }

      // Этап 5: Очистка ресурсов
      regfree(&flags.regex); // Освобождаем ресурсы регулярного выражения
      if (flags.f && flags.pattern) { // Если паттерн был загружен из файла (-f), он в динамической памяти
        free((void *)flags.pattern);
      }
    }
  }

  return exit_code; // Возвращаем код завершения
}