#include "../common/s21_utils.h" // деректива препроцессора

int main(int argc, char *argv[]) { // argc ./s21_cat.c -n file.txt на 3 аргумента, а argv создаёт под каждое слово массив строк и хранит укзатель на этот массив, а в этот массив он записывает по одному символу в массив(char) каждого слова
  int result = 0; // результат выполнения функции, сразу задаём ей значение 0 - успех

  if (argc < 2) { // если кол-во аргументов меньше 2, то бишь просто "./s21_cat.c"
    result = 0; // то тогда просто заканчиваем функию успехом, так как согласно техническому заданию (ТЗ), обработка ввода из стандартного потока (stdin), если не указаны файлы, не обязательна
  } else {
    CatFlags flags; // CatFlags - это как бы новый тип данных с именем CatFlags, который представляет собой структуру из нескольких полей (булевых флагов). А переменная flags у нас с этип типом данных, то есть это тоже самое, что и "int flags"
    parse_cat_flags(argc, argv, &flags); // с помощью переменной flags, которая является указателем(мы это прописали в прототипе функции в parse_cat_flags в s21_utils.h)

    int file_start_idx = 1;
    while (file_start_idx < argc && argv[file_start_idx][0] == '-') {
      file_start_idx++;
    }

    if (file_start_idx >= argc) {
      result = 0;
    } else {
      result = execute_cat(&flags, file_start_idx, argc, argv); // execute_cat возвращает число, если 0 - то успех, иначе не успех
    }
  }
  return result;
}

/* ./s21_cat.c -n file.txt

argc - 3
argc[0] - s21_cat.c
argc[1] - -n
argc[2] - file.txt

./s21_cat.c

Hello - stdin
Hello, Ilya - stdout */