#include "../common/s21_utils.h"

int main(int argc, char *argv[]) {
  int result = 0;

  if (argc < 2) {
    result = 0;
  } else {
    CatFlags flags;
    parse_cat_flags(argc, argv, &flags);

    int file_start_idx = 1;
    while (file_start_idx < argc && argv[file_start_idx][0] == '-') {
      file_start_idx++;
    }

    if (file_start_idx >= argc) {
      result = 0;
    } else {
      result = execute_cat(&flags, file_start_idx, argc, argv);
    }
  }
  return result;
}