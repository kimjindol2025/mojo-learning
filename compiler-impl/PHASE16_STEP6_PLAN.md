# Phase 16 Step 6: Optimization & ELF Linking (Mojo) — 계획

**예상 시작:** 2026-03-15
**예상 기간:** 10-14일
**총 코드량:** 1,000-1,200줄 (Mojo)

---

## 📋 개요

**목표:** x86-64 Assembly → 최적화 → ELF 바이너리 변환

**입력:**
```
x86-64 Assembly Code (Step 5 output)
- Instructions: mov, add, sub, imul, cmp, jmp, call, ret, etc.
- Labels: label_0, label_1, ...
- Comments: Optimization hints
```

**출력:**
```
Executable ELF Binary
- ELF header (64-bit, x86-64)
- .text section (code)
- .data section (constants)
- .symtab section (symbols)
- .strtab section (strings)
- .rel.text section (relocations)
- Entry point: _start or main
```

**다음 단계:** Self-hosting Validation (Step 7)

---

## 🏗️ 아키텍처

### 최적화 패스 (Advanced Optimizer)

```
Input Assembly
    ↓
Constant Propagation
    ↓
Dead Code Elimination (v2)
    ↓
Peephole Optimization
    ↓
Common Subexpression Elimination
    ↓
Register Allocation Optimization
    ↓
Output Optimized Assembly
```

### ELF 바이너리 구조

```
ELF Header (64 bytes)
  - Magic: 0x7f 'E' 'L' 'F'
  - 64-bit, x86-64, executable
  - Entry point: 0x400000
  - Header size: 64 bytes
  - Program header offset: 64
  - Section header offset: varies

Program Header (56 bytes)
  - LOAD segment for .text
  - LOAD segment for .data
  - DYNAMIC segment (if needed)

.text Section
  - Machine code (from assembly)
  - Aligned to 0x1000
  - Offset: 0x400000

.data Section
  - Constants and global data
  - Read-only
  - Offset: 0x401000

.symtab Section
  - Symbol table entries
  - Function names, variable names

.strtab Section
  - String table (symbol names)

.rel.text Section
  - Relocation entries
  - Fix-up references

.shstrtab Section
  - Section name strings
```

### 심볼 테이블 엔트리

```mojo
struct SymbolEntry:
    var name_offset: Int         # Offset in .strtab
    var info: UInt8              # Binding (global/local) + Type (function/variable)
    var other: UInt8             # Visibility
    var section_idx: UInt16      # Section index (1=.text, 2=.data, etc.)
    var value: UInt64            # Address or offset
    var size: UInt64             # Size in bytes
```

### 재배치 엔트리

```mojo
struct RelocationEntry:
    var offset: UInt64           # Offset in .text to fix
    var info: UInt64             # Symbol index + relocation type
    var addend: Int64            # Relocation value
```

---

## 7일 구현 계획

### Day 1: 고급 최적화 패스 (150줄)

**목표:** 4가지 최적화 구현

```mojo
struct AdvancedOptimizer:
    var instructions: List[x86Instruction]
    var constants: Dict[String, Int]       // 상수값 추적
    var variable_values: Dict[String, Int] // 변수값 추적

fn constant_propagation(inout self)
    // mov rax, 10
    // add rax, rcx    → add rax, 10 가능 (만약 rcx=0이면)
    // Constants 맵에서 값 찾기, 가능하면 LOAD_CONST로 변환

fn dead_code_elimination_v2(inout self)
    // v1: RETURN 이후 제거
    // v2: 사용되지 않는 변수 할당 제거
    //     unreachable code 더 정확하게 제거

fn peephole_optimization(inout self)
    // 2-3개 명령어 패턴 인식 및 최적화
    // push rbp; mov rbp, rsp; sub rsp, N → 직접 계산
    // mov rax, X; mov rax, Y → mov rax, Y만
    // cmp rax, 0; je label → test rax, rax; je label (1바이트 짧음)

fn common_subexpression_elimination(inout self)
    // mov rax, [rbp-8]
    // ... (rax 수정 안 함)
    // mov rcx, [rbp-8]  → mov rcx, rax로 변환
    // 공통 부분식 인식 및 재사용
```

**입력:** x86-64 Assembly (Step 5 output)
**출력:** 최적화된 Assembly

---

### Day 2: ELF 생성기 기본 (140줄)

**목표:** ELF 헤더와 기본 구조 구현

```mojo
struct ELFHeader:
    var magic: List[UInt8]       // 0x7f, 'E', 'L', 'F'
    var ei_class: UInt8          // 64-bit (2)
    var ei_data: UInt8           // Little endian (1)
    var ei_version: UInt8        // Version (1)
    var ei_osabi: UInt8          // UNIX System V (0)
    var ei_abiversion: UInt8     // ABI version (0)

    var e_type: UInt16           // Executable (2)
    var e_machine: UInt16        // x86-64 (62)
    var e_version: UInt32        // Version (1)
    var e_entry: UInt64          // Entry point (0x400000)
    var e_phoff: UInt64          // Program header offset (64)
    var e_shoff: UInt64          // Section header offset
    var e_flags: UInt32          // Flags (0)
    var e_ehsize: UInt16         // ELF header size (64)
    var e_phentsize: UInt16      // Program header size (56)
    var e_phnum: UInt16          // Program header count
    var e_shentsize: UInt16      // Section header size (64)
    var e_shnum: UInt16          // Section header count
    var e_shstrndx: UInt16       // Section header string table index

struct ELFGenerator:
    var header: ELFHeader
    var sections: List[ELFSection]
    var symbols: List[SymbolEntry]
    var relocations: List[RelocationEntry]
    var text_section: List[UInt8] // Machine code
    var data_section: List[UInt8] // Constants
```

**메서드:**
```mojo
fn __init__(inout self, text_code: List[UInt8], data_code: List[UInt8])
fn write_elf_header(inout self) -> List[UInt8]
fn write_program_headers(inout self) -> List[UInt8]
fn write_section_headers(inout self) -> List[UInt8]
fn generate_elf(self) -> List[UInt8]  // 최종 바이너리
```

---

### Day 3: 섹션 생성 (130줄)

**목표:** .text, .data, .symtab, .strtab 섹션 생성

```mojo
struct ELFSection:
    var name: String              // ".text", ".data", etc.
    var sh_type: UInt32           // SHT_PROGBITS, SHT_SYMTAB, etc.
    var sh_flags: UInt64          // SHF_ALLOC, SHF_WRITE, SHF_EXECINSTR
    var sh_addr: UInt64           // Virtual address
    var sh_offset: UInt64         // File offset
    var sh_size: UInt64           // Section size
    var sh_link: UInt32           // Link to related section
    var sh_info: UInt32           // Extra info
    var sh_addralign: UInt64      // Alignment
    var sh_entsize: UInt64        // Entry size (for symbol table, etc.)
    var data: List[UInt8]         // Raw data

fn create_text_section(inout self, code: List[UInt8])
    // .text: 코드 섹션
    // Flags: SHF_ALLOC | SHF_EXECINSTR
    // Type: SHT_PROGBITS
    // Address: 0x400000
    // Alignment: 0x1000

fn create_data_section(inout self, data: List[UInt8])
    // .data: 데이터 섹션
    // Flags: SHF_ALLOC | SHF_WRITE
    // Type: SHT_PROGBITS
    // Address: 0x401000

fn create_symtab_section(inout self, symbols: List[String])
    // .symtab: 심볼 테이블
    // Type: SHT_SYMTAB
    // Entry size: 24 bytes
    // 첫 엔트리는 항상 NULL

fn create_strtab_section(inout self, strings: List[String])
    // .strtab: 문자열 테이블
    // Type: SHT_STRTAB
    // 각 문자열을 null로 구분

fn create_shstrtab_section(inout self)
    // .shstrtab: 섹션 이름 문자열
    // 섹션 헤더에서 참조
```

---

### Day 4: 심볼 테이블 & 재배치 (120줄)

**목표:** 심볼 해석 및 재배치 엔트리 생성

```mojo
fn add_symbol(inout self, name: String, is_global: Bool, is_function: Bool,
              section: Int, value: UInt64, size: UInt64)
    // 심볼 추가
    // Binding: GLOBAL (1) or LOCAL (0)
    // Type: FUNC (2) or OBJECT (1)

fn add_relocation(inout self, offset: UInt64, symbol_idx: Int,
                  reloc_type: Int, addend: Int64 = 0)
    // 재배치 엔트리 추가
    // reloc_type: R_X86_64_64 (1), R_X86_64_PC32 (2), R_X86_64_PLT32 (4), etc.

fn resolve_symbols(inout self)
    // 심볼 해석
    // 정의 찾기, 유효성 확인

fn generate_relocations(inout self, assembly: List[x86Instruction])
    // Assembly에서 label reference 찾기
    // 각각에 대해 재배치 엔트리 생성
```

---

### Day 5: 링커 기본 (110줄)

**목표:** 기본 링킹 기능

```mojo
struct Linker:
    var elf_binary: List[UInt8]
    var runtime_lib: List[UInt8]  // libc.so 또는 정적 라이브러리
    var linked_binary: List[UInt8]

fn link_with_runtime(inout self, runtime_path: String)
    // 런타임 라이브러리와 링크
    // printf, malloc, free 등 외부 함수 해석

fn resolve_external_symbols(inout self)
    // 외부 심볼 해석
    // 재배치 엔트리 업데이트

fn finalize(self) -> List[UInt8]
    // 최종 링크된 바이너리 생성
    // 파일 쓰기 가능한 형태로 반환
```

---

### Day 6: 완전한 ELF 생성 (100줄)

**목표:** Assembly → ELF 바이너리 변환 통합

```mojo
fn generate_elf_from_assembly(asm_code: List[x86Instruction>,
                              symbols: Dict[String, String],
                              constants: List[String]) -> List[UInt8]
    // 1. Assembly 어셈블
    //    - 각 명령어 → 기계코드
    //    - 라벨 → 주소로 변환

    // 2. 재배치 엔트리 생성
    //    - 외부 함수 호출 (call printf)
    //    - 데이터 참조 (mov rax, [data_label])

    // 3. ELF 헤더/섹션 작성
    //    - 모든 섹션 병합
    //    - 오프셋 계산

    // 4. 최종 바이너리 생성
    //    - 바이트 배열 반환
```

---

### Day 7: 검증 & 테스트 (200줄)

**목표:** verify-step6.js 작성 및 모든 테스트 통과

```javascript
Test Suite 1: Advanced Optimizer
  ✓ Constant propagation
  ✓ Dead code elimination
  ✓ Peephole optimization
  ✓ Common subexpression elimination

Test Suite 2: ELF Generator
  ✓ ELF header generation
  ✓ Program header creation
  ✓ Section header creation

Test Suite 3: Symbol Table
  ✓ Symbol addition
  ✓ Symbol resolution
  ✓ Global vs local symbols

Test Suite 4: Relocations
  ✓ Relocation entry creation
  ✓ External symbol handling
  ✓ Relocation patching

Test Suite 5: Complete Pipeline
  ✓ Assembly → ELF conversion
  ✓ Binary validity check
  ✓ Executable verification

Test Suite 6: Integration
  ✓ Step 5 output → Step 6 input
  ✓ Linking with runtime
  ✓ Final executable generation
```

---

## 📊 코드 통계

```
Files:
├── optimizer.mojo              150 lines (Day 1: Advanced optimization)
├── elf-generator.mojo          500 lines (Days 2-4: ELF generation)
├── linker.mojo                 100 lines (Day 5: Linking)
├── integration.mojo             50 lines (Day 6: Full pipeline)
└── verify-step6.js             200 lines (Day 7: Verification)

Total: ~1,000 lines
```

---

## 🔗 Step 5 ↔ Step 6 통합

### 입력 (Step 5: Machine Code Generator output)

```
x86-64 Assembly Instructions:
[
  { mnemonic: "push", operands: ["rbp"], comment: "Prologue" },
  { mnemonic: "mov", operands: ["rbp", "rsp"], comment: "" },
  { mnemonic: "mov", operands: ["rax", "10"], comment: "LOAD_CONST 0" },
  { mnemonic: "mov", operands: ["[rbp-8]", "rax"], comment: "STORE_VAR x" },
  { mnemonic: "call", operands: ["printf"], comment: "CALL" },
  { mnemonic: "mov", operands: ["rsp", "rbp"], comment: "Epilogue" },
  { mnemonic: "pop", operands: ["rbp"], comment: "" },
  { mnemonic: "ret", operands: [], comment: "" }
]

Symbols:
{
  "main": { type: "function", section: ".text" },
  "printf": { type: "external", section: "UNDEFINED" }
}

Constants:
["10", "20", "hello"]
```

### 처리 과정

```
1. 어셈블 (Assembly → Machine Code)
   - 각 x86 명령어를 기계코드로 변환
   - 라벨 주소 계산
   - 우선 패스: 모든 주소 계산
   - 두 번째 패스: 재배치 엔트리 생성

2. 최적화
   - Constant propagation
   - Dead code elimination
   - Peephole optimization
   - CSE

3. ELF 생성
   - ELF header: 64 bytes
   - Program headers
   - .text section (코드)
   - .data section (상수)
   - .symtab section (심볼)
   - .strtab section (문자열)
   - .shstrtab section (섹션 이름)
   - .rel.text section (재배치)

4. 링킹
   - 외부 심볼 해석 (printf, malloc, etc.)
   - 런타임 라이브러리 참조
   - 재배치 패치

5. 최종 바이너리
   - 실행 가능한 ELF 파일
   - 0x400000에서 실행 시작
   - main() 함수 호출
```

### 출력 (ELF 바이너리)

```
ELF 파일 구조:
[ELF Header: 64 bytes]
[Program Header 1: .text - 56 bytes]
[Program Header 2: .data - 56 bytes]
[.text Section: 코드]
  00400000:  55                push rbp
  00400001:  48 89 e5         mov rbp, rsp
  00400004:  48 c7 45 f8 0a   mov qword [rbp-8], 10
  ...
[.data Section: 상수]
  0000000a (constant 10)
  0000000e (constant 20)
  ...
[.symtab Section]
[.strtab Section]
[.shstrtab Section]
[.rel.text Section]
[Section Headers]
```

---

## ✅ Success Criteria

✅ 모든 최적화 패스 구현 및 작동
✅ ELF 헤더 올바른 생성
✅ 모든 섹션 올바른 생성
✅ 심볼 테이블 올바른 생성
✅ 재배치 엔트리 올바르게 생성
✅ 외부 심볼 해석 가능
✅ verify-step6.js 모든 테스트 통과
✅ 생성된 바이너리 유효성 확인 (readelf 사용)
✅ Step 5 output과 완전 호환
✅ 최종 바이너리 실행 가능

---

## 📅 타임라인

| Day | Deliverable | Lines | Status |
|-----|-------------|-------|--------|
| 1 | Advanced Optimizer | 150 | ⬜ |
| 2 | ELF Generator Basics | 140 | ⬜ |
| 3 | Section Creation | 130 | ⬜ |
| 4 | Symbol & Relocation | 120 | ⬜ |
| 5 | Linker | 110 | ⬜ |
| 6 | Full Integration | 100 | ⬜ |
| 7 | Testing & Validation | 200 | ⬜ |

**Total:** 950 줄

---

## 🚀 시작 전 필수사항

1. ✅ Step 5 Machine Code Generator 완성
2. ✅ verify-step5.js 모든 테스트 통과
3. ✅ x86-64 명령어 → 기계코드 매핑 이해
4. ✅ ELF 파일 형식 학습
5. ✅ 심볼 테이블 구조 이해
6. ✅ 재배치 메커니즘 이해

---

**Ready for Step 6 implementation? YES - 2026-03-15 시작 가능** 🚀
