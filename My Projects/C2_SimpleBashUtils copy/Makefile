CC = gcc
CFLAGS = -std=c11 -Wall -Wextra -Werror -pedantic

# Папки
SRC_COMMON = src/common
SRC_CAT = src/cat
SRC_GREP = src/grep

# Файлы
COMMON_SRC = $(SRC_COMMON)/s21_utils.c
COMMON_OBJ = $(COMMON_SRC:.c=.o)

CAT_SRC = $(SRC_CAT)/s21_cat.c
CAT_OBJ = $(CAT_SRC:.c=.o)
CAT_TARGET = $(SRC_CAT)/s21_cat

GREP_SRC = $(SRC_GREP)/s21_grep.c
GREP_OBJ = $(GREP_SRC:.c=.o)
GREP_TARGET = $(SRC_GREP)/s21_grep

all: s21_cat s21_grep

s21_cat: $(CAT_OBJ) $(COMMON_OBJ)
	$(CC) $(CFLAGS) -o $(CAT_TARGET) $^ $(LDFLAGS)

s21_grep: $(GREP_OBJ) $(COMMON_OBJ)
	$(CC) $(CFLAGS) -o $(GREP_TARGET) $^ $(LDFLAGS)

# Компиляция объектных файлов
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(CAT_TARGET) $(GREP_TARGET)
	rm -f $(SRC_COMMON)/*.o $(SRC_CAT)/*.o $(SRC_GREP)/*.o

# Псевдо-цели
.PHONY: all clean s21_cat s21_grep