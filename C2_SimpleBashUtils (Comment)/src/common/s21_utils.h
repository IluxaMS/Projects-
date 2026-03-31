#ifndef S21_UTILS_H
#define S21_UTILS_H

#define _POSIX_C_SOURCE 200809L

#include <ctype.h>
#include <errno.h>
#include <regex.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_PATTERNS 100

typedef struct {
  bool b;
  bool e;
  bool n;
  bool s;
  bool t;
  bool v;
  bool E_flag;
  bool T_flag;
} CatFlags;

typedef struct {
  bool e;
  bool i;
  bool v;
  bool c;
  bool l;
  bool n;
  bool h;
  bool s;
  bool f;
  bool o;

  char *patterns[MAX_PATTERNS];
  int pattern_count;
  regex_t regexes[MAX_PATTERNS];
  bool pattern_needs_free[MAX_PATTERNS];
} GrepFlags;

void parse_cat_flags(int argc, char *argv[], CatFlags *flags);
void parse_grep_flags_main(int argc, char *argv[], GrepFlags *flags,
                           int *pattern_count, int *file_start_idx);
int execute_cat(CatFlags *flags, int file_start_idx, int argc, char *argv[]);
int execute_grep(GrepFlags *flags, int file_start_idx, int argc, char *argv[]);
void print_visual_char(unsigned char c, FILE *out);

#endif