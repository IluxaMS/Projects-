// Вспомогательная функция для обработки флага -e
static void handle_flag_e(char **argv, int *i, int argc, 
                          char **patterns, int *count, bool *e_flag) {
  if (*i + 1 >= argc || *count >= MAX_PATTERNS) return;
  
  (*i)++; // Сдвигаем индекс на аргумент-паттерн
  patterns[(*count)++] = argv[*i];
  *e_flag = true;
}

// Вспомогательная функция для обработки флага -f
static void handle_flag_f(char **argv, int *i, GrepFlags *flags, int *count) {
  if (*i + 1 >= argc) return;
  
  (*i)++; // Сдвигаем индекс на имя файла
  FILE *fp = fopen(argv[*i], "r");
  
  if (!fp) {
    if (!flags->s) {
      fprintf(stderr, "s21_grep: %s: %s\n", argv[*i], strerror(errno));
    }
    return;
  }

  char buf[1024];
  while (fgets(buf, sizeof(buf), fp) && *count < MAX_PATTERNS) {
    buf[strcspn(buf, "\n")] = 0;
    if (strlen(buf) > 0) {
      flags->patterns[*count] = strdup(buf);
      (*count)++;
      flags->e = true;
      flags->f = true;
    }
  }
  fclose(fp);
}

void parse_grep_flags_main(int argc, char *argv[], GrepFlags *flags,
                           int *pattern_count, int *file_start_idx) {
  memset(flags, 0, sizeof(GrepFlags));
  *pattern_count = 0;
  *file_start_idx = argc;

  for (int i = 1; i < argc; i++) {
    bool skip_rest = false;
    
    if (argv[i][0] == '-') {
      for (int j = 1; argv[i][j] != '\0' && !skip_rest; j++) {
        switch (argv[i][j]) {
          case 'e':
            handle_flag_e(argv, &i, argc, flags->patterns, pattern_count, &flags->e);
            skip_rest = true;
            break;
            
          case 'f':
            handle_flag_f(argv, &i, flags, pattern_count);
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
        flags->patterns[(*pattern_count)++] = argv[i];
        flags->e = true;
      } else if (flags->e && *file_start_idx == argc) {
        *file_start_idx = i;
      }
    }
  }
}