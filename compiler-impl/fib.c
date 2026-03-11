#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int32_t fibonacci(int32_t n);
void _mojo_main(void);

int32_t fibonacci(int32_t n) {
  int32_t t0 = 0;
  int32_t t1 = 0;
  int32_t t2 = 0;
  int32_t t3 = 0;
  int32_t t4 = 0;
  int32_t t5 = 0;

  t0 = n + 1;
  // Conditional branch: if (t0) goto bb0; else goto bb1;
  return n;
  // Branch: goto bb2;
  t1 = n - 1;
  t2 = fibonacci(t1);
  t3 = n - 2;
  t4 = fibonacci(t3);
  t5 = t2 + t4;
  return t5;
  // Branch: goto bb2;
  return 0;  // Default return for i32
}

void _mojo_main(void) {
  return;
  return;
}

int main(int argc, char* argv[]) {
  _mojo_main();
  return 0;
}