#include "../common/s21_utils.h"

int main(int argc, char *argv[]) {
  if (argc < 2) {
    return 0;
  }

  CatFlags flags;
  parse_cat_flags(argc, argv, &flags);
  int file_start_idx = 1;

  while (file_start_idx < argc && argv[file_start_idx][0] == '-') {
    file_start_idx++;
  }

  if (file_start_idx >= argc) {
    return 0;
  }
  
  return execute_cat(&flags, file_start_idx, argc, argv);
}