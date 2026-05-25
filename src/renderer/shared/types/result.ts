// IPC 경계 Result 타입 — renderer 쪽 미러.
//
// main의 src/main/types/result.ts 와 모양을 일치시킬 것.
// (tsconfig가 분리되어 있어 직접 import 불가. 약간의 중복은 의도된 트레이드오프.)

export type FailureReason =
  | 'cancelled'
  | 'not-found'
  | 'permission'
  | 'invalid'
  | 'unknown';

export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; reason: FailureReason; error: E };

// 타입 가드 — `if (isOk(result)) { result.value }` 식 사용.
export const isOk = <T, E>(r: Result<T, E>): r is { ok: true; value: T } => r.ok;
export const isErr = <T, E>(r: Result<T, E>): r is { ok: false; reason: FailureReason; error: E } => !r.ok;
