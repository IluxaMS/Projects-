#define _POSIX_C_SOURCE 200809L

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../common/s21_utils.h"

int main(int argc, char *argv[]) {
  int exit_code = 0;

  if (argc < 2) {
    fprintf(stderr, "Usage: s21_grep [options] PATTERN [FILE...]\n");
    exit_code = 2;
  } else {
    GrepFlags flags;
    int pattern_count = 0;
    int file_start_idx = argc;

    parse_grep_flags_main(argc, argv, &flags, &pattern_count, &file_start_idx);

    flags.pattern_count = pattern_count;

    if (!flags.e || flags.pattern_count == 0) {
      fprintf(stderr, "s21_grep: No pattern provided\n");
      exit_code = 2;
    } else {
      if (file_start_idx != argc) {
        exit_code = execute_grep(&flags, file_start_idx, argc, argv);
      }
      
      // ОСВОБОЖДЕНИЕ ПАМЯТИ ПРОИСХОДИТ ТОЛЬКО ЗДЕСЬ
      for (int k = 0; k < flags.pattern_count; k++) {
        if (flags.pattern_needs_free[k]) {
          free(flags.patterns[k]);
        }
      }
    }
  }
  return exit_code;
}