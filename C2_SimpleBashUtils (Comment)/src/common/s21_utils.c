#define _POSIX_C_SOURCE 200809L

#include "s21_utils.h"

void print_visual_char(unsigned char c, FILE *out) {
  if (c == '\t') {
    fprintf(out, "^I");
  } else if (c == '\n') {
    fputc('\n', out);
  } else if (c < 32 || c == 127) {
    fprintf(out, "^%c", c + 64);
  } else if (c > 127) {
    fprintf(out, "M-%c", c - 128 + 64);
  } else {
    fputc(c, out);
  }
}

void parse_cat_flags(int argc, char *argv[], CatFlags *flags) {
  memset(flags, 0, sizeof(CatFlags));
  for (int i = 1; i < argc; i++) {
    if (argv[i][0] == '-') {
      for (int j = 1; argv[i][j] != '\0'; j++) {
        switch (argv[i][j]) {
          case 'b': flags->b = true; break;
          case 'e': flags->e = true; flags->v = true; break;
          case 'E': flags->E_flag = true; flags->e = true; break;
          case 'n': flags->n = true; break;
          case 's': flags->s = true; break;
          case 't': flags->t = true; flags->v = true; break;
          case 'T': flags->T_flag = true; flags->t = true; break;
          case 'v': flags->v = true; break;
          default: break;
        }
      }
    }
  }
}

static void handle_flag_e(char **argv, int *i, int argc,
                          char **patterns, int *count, bool *e_flag, bool *needs_free) {
  if (*i + 1 < argc && *count < MAX_PATTERNS) {
    (*i)++;
    patterns[(*count)] = argv[*i];
    needs_free[*count] = false;
    (*count)++;
    *e_flag = true;
  }
}

static void handle_flag_f(char **argv, int *i, int argc, 
                          GrepFlags *flags, int *count) {
  if (*i + 1 < argc) {
    (*i)++;
    FILE *fp = fopen(argv[*i], "r");
    if (fp) {
      char buf[1024];
      while (fgets(buf, sizeof(buf), fp) && *count < MAX_PATTERNS) {
        buf[strcspn(buf, "\n")] = 0;
        if (strlen(buf) > 0) {
          flags->patterns[*count] = strdup(buf);
          flags->pattern_needs_free[*count] = true;
          (*count)++;
          flags->e = true;
          flags->f = true;
        }
      }
      fclose(fp);
    } else if (!flags->s) {
      fprintf(stderr, "s21_grep: %s: %s\n", argv[*i], strerror(errno));
    }
  }
}

void parse_grep_flags_main(int argc, char *argv[], GrepFlags *flags,
                           int *pattern_count, int *file_start_idx) {
  memset(flags, 0, sizeof(GrepFlags));
  *pattern_count = 0;
  *file_start_idx = argc;

  for (int k = 0; k < MAX_PATTERNS; k++) {
    flags->pattern_needs_free[k] = false;
  }

  for (int i = 1; i < argc; i++) {
    bool skip_rest = false;
    if (argv[i][0] == '-') {
      for (int j = 1; argv[i][j] != '\0' && !skip_rest; j++) {
        switch (argv[i][j]) {
          case 'e':
            handle_flag_e(argv, &i, argc, flags->patterns, pattern_count, &flags->e, flags->pattern_needs_free);
            skip_rest = true;
            break;
          case 'f':
            handle_flag_f(argv, &i, argc, flags, pattern_count);
            skip_rest = true;
            break;
          case 'i': flags->i = true; break;
          case 'v': flags->v = true; break;
          case 'c': flags->c = true; break;
          case 'l': flags->l = true; break;
          case 'n': flags->n = true; break;
          case 'h': flags->h = true; break;
          case 's': flags->s = true; break;
          case 'o': flags->o = true; break;
          default: break;
        }
      }
    } else {
      if (!flags->e && *pattern_count < MAX_PATTERNS) {
        flags->patterns[*pattern_count] = argv[i];
        flags->pattern_needs_free[*pattern_count] = false;
        (*pattern_count)++;
        flags->e = true;
      } else if (flags->e && *file_start_idx == argc) {
        *file_start_idx = i;
      }
    }
  }
}

static bool is_line_empty(const char *line) {
  bool empty = true;
  for (size_t k = 0; line[k] != '\0'; k++) {
    if (line[k] != '\n' && line[k] != '\r') {
      empty = false;
      break;
    }
  }
  return empty;
}

static void cat_print_numbering(const CatFlags *flags, bool empty,
                                int *line_num, int *non_empty_num) {
  if (flags->n || (flags->b && !empty)) {
    if (flags->b && !empty) (*non_empty_num)++;
    if (flags->n) (*line_num)++;
    int num = flags->n ? *line_num : *non_empty_num;
    printf("%6d\t", num);
  }
}

static void cat_print_content(const char *line, const CatFlags *flags) {
  for (size_t k = 0; line[k] != '\0'; k++) {
    unsigned char ch = line[k];
    if (ch == '\n') {
      if (flags->e || flags->E_flag) printf("$\n");
      else fputc('\n', stdout);
    } else if (ch == '\t' && (flags->t || flags->T_flag)) {
      printf("^I");
    } else if (flags->v && (ch < 32 || ch == 127 || ch > 127)) {
      print_visual_char(ch, stdout);
    } else {
      fputc(ch, stdout);
    }
  }
}

static void cat_process_single_line(const char *line, const CatFlags *flags,
                                    int *line_num, int *non_empty_num,
                                    bool *prev_empty) {
  bool empty = is_line_empty(line);
  bool should_skip = false;

  if (flags->s && empty) {
    if (*prev_empty) {
      should_skip = true;
    } else {
      *prev_empty = true;
    }
  } else {
    *prev_empty = false;
  }

  if (!should_skip) {
    cat_print_numbering(flags, empty, line_num, non_empty_num);
    cat_print_content(line, flags);
  }
}

int execute_cat(CatFlags *flags, int file_start_idx, int argc, char *argv[]) {
  int line_num = 0;
  int non_empty_num = 0;
  bool prev_empty = false;
  int error_status = 0;

  if (file_start_idx >= argc) {
    error_status = 0;
  } else {
    for (int i = file_start_idx; i < argc; i++) {
      FILE *fp = fopen(argv[i], "r");
      if (!fp) {
        fprintf(stderr, "s21_cat: %s: %s\n", argv[i], strerror(errno));
        error_status = 1;
      } else {
        char *line = NULL;
        size_t len = 0;
        while (getline(&line, &len, fp) != -1) {
          cat_process_single_line(line, flags, &line_num, &non_empty_num, &prev_empty);
        }
        free(line);
        fclose(fp);
      }
    }
  }
  
  return error_status;
}

static bool grep_check_match(const GrepFlags *flags, const char *line) {
  bool match = false;
  for (int p = 0; p < flags->pattern_count; p++) {
    if (regexec(&flags->regexes[p], line, 0, NULL, 0) == 0) {
      match = true;
      break;
    }
  }
  return match;
}

static void grep_handle_flag_o(const GrepFlags *flags, const char *line,
                               int line_num, bool multiple_files, const char *fname) {
  bool found_pattern = false;
  for (int p = 0; p < flags->pattern_count && !found_pattern; p++) {
    regmatch_t pmatch[10];
    if (regexec(&flags->regexes[p], line, 10, pmatch, 0) == 0) {
      int offset = 0;
      bool found_any = false;
      bool stop_loop = false;
      while (!stop_loop && regexec(&flags->regexes[p], line + offset, 10, pmatch, 0) == 0) {
        if (!found_any) {
          if (!flags->h && multiple_files) printf("%s:", fname);
          if (flags->n) printf("%d:", line_num);
          found_any = true;
        } else {
          if (!flags->h && multiple_files) printf("%s:", fname);
          if (flags->n) printf("%d:", line_num);
        }
        for (int j = pmatch[0].rm_so; j < pmatch[0].rm_eo; j++) {
          putchar(line[offset + j]);
        }
        putchar('\n');
        offset += pmatch[0].rm_eo;
        if (pmatch[0].rm_so == pmatch[0].rm_eo) offset++;
        if (offset >= (int)strlen(line)) stop_loop = true;
      }
      found_pattern = true;
    }
  }
}

static int grep_process_file(const char *filename, const GrepFlags *flags,
                              bool multiple_files, bool *any_match) {
  int file_error = 0;
  FILE *fp = fopen(filename, "r");
  
  if (!fp) {
    if (!flags->s) {
      fprintf(stderr, "s21_grep: %s: %s\n", filename, strerror(errno));
    }
    file_error = 2;
  } else {
    char *line = NULL;
    size_t len = 0;
    int line_num = 0;
    int file_matches = 0;
    bool finished = false;

    while (!finished && getline(&line, &len, fp) != -1) {
      line_num++;
      size_t ln = strlen(line);
      if (ln > 0 && line[ln - 1] == '\n') line[ln - 1] = '\0';

      bool match = grep_check_match(flags, line);
      if (flags->v) match = !match;

      if (match) {
        *any_match = true;
        file_matches++;
        
        if (flags->l) {
          printf("%s\n", filename);
          finished = true;
        } else if (!flags->c && !flags->o) {
          if (!flags->h && multiple_files) printf("%s:", filename);
          if (flags->n) printf("%d:", line_num);
          printf("%s\n", line);
        } else if (flags->o && !flags->v) {
          grep_handle_flag_o(flags, line, line_num, multiple_files, filename);
        }
      }
    }

    if (flags->c) {
      if (!flags->h && multiple_files) printf("%s:", filename);
      printf("%d\n", file_matches);
    }
    free(line);
    fclose(fp);
  }
  
  return file_error;
}

int execute_grep(GrepFlags *flags, int file_start_idx, int argc, char *argv[]) {
  int final_status = 0;
  bool any_match = false;
  int compile_error = 0;

  if (!flags->e || flags->pattern_count == 0) {
    final_status = 2;
  } else {
    int cflags = REG_EXTENDED;
    if (flags->i) cflags |= REG_ICASE;

    for (int p = 0; p < flags->pattern_count; p++) {
      if (regcomp(&flags->regexes[p], flags->patterns[p], cflags) != 0) {
        fprintf(stderr, "s21_grep: Invalid regex pattern\n");
        compile_error = 1;
        break;
      }
    }

    if (!compile_error) {
      bool multiple_files = (argc - file_start_idx > 1);
      for (int i = file_start_idx; i < argc; i++) {
        int file_status = grep_process_file(argv[i], flags, multiple_files, &any_match);
        if (file_status == 2) {
          final_status = 2;
        }
      }
      
      if (final_status == 0 && !any_match) {
        final_status = 1;
      }
    } else {
      final_status = 2;
    }

    // ОСВОБОЖДАЕМ ТОЛЬКО РЕГЕКСЫ. ПАТТЕРНЫ ОСВОБОЖДАЕТ MAIN!
    for (int p = 0; p < flags->pattern_count; p++) {
      regfree(&flags->regexes[p]);
    }
    
    // БЛОК FREE(patterns) ЗДЕСЬ ОТСУТСТВУЕТ НАМЕРЕННО
  }
  
  return final_status;
}