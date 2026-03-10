/**
 * Mojo Compiler - AST (Abstract Syntax Tree) Node Definitions
 *
 * 모든 Mojo 프로그램은 이 AST 노드들의 조합으로 표현됩니다.
 */

export interface ASTNode {
  type: string;
  line: number;
  column: number;
}

// ============= 타입 표현 =============

export interface TypeAnnotation extends ASTNode {
  type: "TypeAnnotation";
  name: string;
  isParametric: boolean;
  parameters?: (TypeAnnotation | string)[];
}

// ============= 표현식 (Expression) =============

export interface IntLiteral extends ASTNode {
  type: "IntLiteral";
  value: number;
}

export interface FloatLiteral extends ASTNode {
  type: "FloatLiteral";
  value: number;
}

export interface StringLiteral extends ASTNode {
  type: "StringLiteral";
  value: string;
}

export interface BoolLiteral extends ASTNode {
  type: "BoolLiteral";
  value: boolean;
}

export interface Identifier extends ASTNode {
  type: "Identifier";
  name: string;
  ownership?: "owned" | "borrowed" | "mut";
}

export interface BinaryOp extends ASTNode {
  type: "BinaryOp";
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryOp extends ASTNode {
  type: "UnaryOp";
  operator: string;
  operand: Expression;
}

export interface Call extends ASTNode {
  type: "Call";
  function: Expression;
  arguments: Expression[];
  parametricArgs?: (TypeAnnotation | Expression)[];
}

export interface FieldAccess extends ASTNode {
  type: "FieldAccess";
  object: Expression;
  field: string;
}

export interface IndexAccess extends ASTNode {
  type: "IndexAccess";
  object: Expression;
  index: Expression;
}

export interface ArrayLiteral extends ASTNode {
  type: "ArrayLiteral";
  elements: Expression[];
}

export interface IfExpr extends ASTNode {
  type: "IfExpr";
  condition: Expression;
  thenBranch: Expression[];
  elseBranch?: Expression[];
  elseIfBranches?: Array<{
    condition: Expression;
    body: Expression[];
  }>;
}

export interface MatchExpr extends ASTNode {
  type: "MatchExpr";
  value: Expression;
  cases: Array<{
    pattern: string | number;
    body: Expression[];
  }>;
  defaultCase?: Expression[];
}

export type Expression =
  | IntLiteral
  | FloatLiteral
  | StringLiteral
  | BoolLiteral
  | Identifier
  | BinaryOp
  | UnaryOp
  | Call
  | FieldAccess
  | IndexAccess
  | ArrayLiteral
  | IfExpr
  | MatchExpr;

// ============= 명령문 (Statement) =============

export interface VariableDeclaration extends ASTNode {
  type: "VariableDeclaration";
  name: string;
  typeAnnotation?: TypeAnnotation;
  value?: Expression;
  isMutable: boolean;
}

export interface Assignment extends ASTNode {
  type: "Assignment";
  target: Identifier | FieldAccess | IndexAccess;
  value: Expression;
  operator?: string; // +=, -=, *=, /= 등
}

export interface ExpressionStatement extends ASTNode {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface ReturnStatement extends ASTNode {
  type: "ReturnStatement";
  value?: Expression;
}

export interface ForLoop extends ASTNode {
  type: "ForLoop";
  variable: string;
  iterable: Expression;
  body: Statement[];
}

export interface WhileLoop extends ASTNode {
  type: "WhileLoop";
  condition: Expression;
  body: Statement[];
}

export interface BreakStatement extends ASTNode {
  type: "BreakStatement";
}

export interface ContinueStatement extends ASTNode {
  type: "ContinueStatement";
}

export type Statement =
  | VariableDeclaration
  | Assignment
  | ExpressionStatement
  | ReturnStatement
  | ForLoop
  | WhileLoop
  | BreakStatement
  | ContinueStatement;

// ============= 함수 및 구조체 =============

export interface Parameter extends ASTNode {
  type: "Parameter";
  name: string;
  typeAnnotation: TypeAnnotation;
  ownership: "owned" | "borrowed" | "mut";
}

export interface FunctionDeclaration extends ASTNode {
  type: "FunctionDeclaration";
  name: string;
  parameters: Parameter[];
  returnType?: TypeAnnotation;
  body: Statement[];
  parametricParams?: Array<{
    name: string;
    constraint?: string; // DType, Int 등
  }>;
}

export interface StructField extends ASTNode {
  type: "StructField";
  name: string;
  typeAnnotation: TypeAnnotation;
}

export interface StructDeclaration extends ASTNode {
  type: "StructDeclaration";
  name: string;
  fields: StructField[];
}

export interface Program extends ASTNode {
  type: "Program";
  items: (FunctionDeclaration | StructDeclaration)[];
}

// ============= 메타 정보 =============

export interface CompilationUnit {
  program: Program;
  errors: CompileError[];
  warnings: string[];
}

export interface CompileError {
  message: string;
  line: number;
  column: number;
  code: string;
}

// ============= 빌더 헬퍼 =============

export function createIntLiteral(
  value: number,
  line: number,
  column: number
): IntLiteral {
  return { type: "IntLiteral", value, line, column };
}

export function createBinaryOp(
  operator: string,
  left: Expression,
  right: Expression,
  line: number,
  column: number
): BinaryOp {
  return { type: "BinaryOp", operator, left, right, line, column };
}

export function createIdentifier(
  name: string,
  line: number,
  column: number,
  ownership?: "owned" | "borrowed" | "mut"
): Identifier {
  return { type: "Identifier", name, line, column, ownership };
}
