.file "<stdin>"
.text
.globl main

.text

multiply:
  pushq %rbp
  movq %rsp, %rbp
  subq $8, %rsp
  movq %rdi, %rax
  imulq %rsi, %rax
  movq %rax, -8(%rbp)
  movq -8(%rbp), %rax
  movq %rbp, %rsp
  popq %rbp
  retq

_mojo_main:
  pushq %rbp
  movq %rsp, %rbp
  xorq %rax, %rax
  movq %rbp, %rsp
  popq %rbp
  retq

main:
  pushq %rbp
  movq %rsp, %rbp
  callq _mojo_main
  xorq %rax, %rax
  movq %rbp, %rsp
  popq %rbp
  retq