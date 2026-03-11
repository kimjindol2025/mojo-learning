#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int32_t multiply(int32_t x, int32_t y);
void _mojo_main(void);

int32_t multiply(int32_t x, int32_t y) {
  int32_t t0 = 0;

  t0 = x * y;
  return t0;
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