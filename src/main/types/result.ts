// IPC 경계에서 쓰는 Result 타입 — main 쪽 정의.
//
// 학습 포인트:
//   1) 도메인 실패(파일 없음, 사용자 취소 등)와 진짜 버그(코드 오류)를 분리.
//      도메인 실패 → Result로 값 반환. 코드 버그 → throw → IPC reject로 전파.
//   2) reason은 프로그래밍적 분기용, error는 사용자/로그 표시용.
//   3) renderer에 동일 모양이 미러 정의됨 (src/renderer/shared/types/result.ts).
//      tsconfig 분리 때문에 직접 import 못함 → 모양만 맞추는 컨벤션.

export type FailureReason =
  | 'cancelled'   // 사용자가 명시적으로 취소 (dialog 닫기 등)
  | 'not-found'   // 대상이 존재하지 않음
  | 'permission'  // 접근 권한 없음
  | 'invalid'     // 입력 형식/내용이 잘못됨
  | 'unknown';    // 분류되지 않은 실패

export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; reason: FailureReason; error: E };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

export const err = (reason: FailureReason, error: string): Result<never, string> => ({
  ok: false,
  reason,
  error,
});

// Node.js 에러 코드 → FailureReason 매핑 헬퍼.
// catch (e: unknown)로 받은 에러를 그대로 넘기면 reason까지 자동 분류.
export function errFromException(e: unknown): Result<never, string> {
  const code = typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: unknown }).code) : '';
  const message = e instanceof Error ? e.message : String(e);
  switch (code) {
    case 'ENOENT':
      return err('not-found', message);
    case 'EACCES':
    case 'EPERM':
      return err('permission', message);
    default:
      return err('unknown', message);
  }
}
