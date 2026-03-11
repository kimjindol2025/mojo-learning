.file "<stdin>"
.text
.globl main

.text

fibonacci:
  pushq %rbp
  movq %rsp, %rbp
  subq $48, %rsp
  movq %rdi, %rax
  addq $1, %rax
  movq %rax, -8(%rbp)
  # br i1 %t0, label %bb0, label %bb1
  movq %rdi, %rax
  # br label %bb2
  movq %rdi, %rax
  subq $1, %rax
  movq %rax, -16(%rbp)
  movq -16(%rbp), %rdi
  callq fibonacci
  movq %rax, -24(%rbp)
  movq %rdi, %rax
  subq $2, %rax
  movq %rax, -32(%rbp)
  movq -32(%rbp), %rdi
  callq fibonacci
  movq %rax, -40(%rbp)
  movq -24(%rbp), %rax
  addq -40(%rbp), %rax
  movq %rax, -48(%rbp)
  movq -48(%rbp), %rax
  # br label %bb2
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