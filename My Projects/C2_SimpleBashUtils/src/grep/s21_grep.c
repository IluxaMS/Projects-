#define _POSIX_C_SOURCE 200809L

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../common/s21_utils.h"

int main(int argc, char *argv[]) {
  if (argc < 2) {
    fprintf(stderr, "Usage: s21_grep [options] PATTERN [FILE...]\n");
    return 1;
  }

  GrepFlags flags;
  memset(&flags, 0, sizeof(GrepFlags));

  int pattern_count = 0;
  int file_start_idx = argc;

  for (int i = 1; i < argc; i++) {
    bool skip_rest_of_arg = false;

    if (argv[i][0] == '-') {
      for (int j = 1; argv[i][j] != '\0' && !skip_rest_of_arg; j++) {
        switch (argv[i][j]) {
          case 'e':
            if (i + 1 < argc) {
              i++;
              if (pattern_count < MAX_PATTERNS) {
                flags.patterns[pattern_count++] = argv[i];
                flags.e = true;
              }
              skip_rest_of_arg = true; // Замена goto: прерываем цикл по j
            } else {
              fprintf(stderr, "s21_grep: option requires an argument -- 'e'\n");
              return 1;
            }
            break;
          case 'f':
            if (i + 1 < argc) {
              i++;
              FILE *fp = fopen(argv[i], "r");
              if (fp) {
                char buf[1024];
                while (fgets(buf, sizeof(buf), fp) &&
                       pattern_count < MAX_PATTERNS) {
                  buf[strcspn(buf, "\n")] = 0;
                  if (strlen(buf) > 0) {
                    flags.patterns[pattern_count] = strdup(buf);
                    pattern_count++;
                    flags.e = true;
                    flags.f = true;
                  }
                }
                fclose(fp);
              } else {
                if (!flags.s) {
                  fprintf(stderr, "s21_grep: %s: %s\n", argv[i],
                          strerror(errno));
                }
              }
              skip_rest_of_arg = true; // Замена goto
            } else {
              fprintf(stderr, "s21_grep: option requires an argument -- 'f'\n");
              return 1;
            }
            break;
          case 'i': flags.i = true; break;
          case 'v': flags.v = true; break;
          case 'c': flags.c = true; break;
          case 'l': flags.l = true; break;
          case 'n': flags.n = true; break;
          case 'h': flags.h = true; break;
          case 's': flags.s = true; break;
          case 'o': flags.o = true; break;
          default: break;
        }
      }
    } else {
      if (!flags.e) {
        if (pattern_count < MAX_PATTERNS) {
          flags.patterns[pattern_count++] = argv[i];
          flags.e = true;
        }
      } else {
        if (file_start_idx == argc) {
          file_start_idx = i;
        }
      }
    }
  }

  flags.pattern_count = pattern_count;

  if (!flags.e || flags.pattern_count == 0) {
    fprintf(stderr, "s21_grep: No pattern provided\n");
    return 1;
  }

  if (file_start_idx == argc) {
    return 0;
  }

  execute_grep(&flags, file_start_idx, argc, argv);

  if (flags.f) {
    for (int k = 0; k < flags.pattern_count; k++) {
      free(flags.patterns[k]);
    }
  }

  return 0;
}