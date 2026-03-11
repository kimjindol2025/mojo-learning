.file "<stdin>"
.text
.globl main

.text

check_positive:
  pushq %rbp
  movq %rsp, %rbp
  subq $8, %rsp
  movq %rdi, %rax
  addq $0, %rax
  movq %rax, -8(%rbp)
  movq -8(%rbp), %r10
  testq %r10, %r10
  jnz .Lbb0
  jmp .Lbb1
.Lbb0:
  movq $1, %rax
  jmp .Lbb2
.Lbb1:
  movq $0, %rax
  jmp .Lbb2
.Lbb2:
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