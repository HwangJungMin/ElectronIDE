// useWorkspaceCommands: workspace 도메인 커맨드 등록 훅.
//
// 학습 포인트 — Result 패턴 소비:
//   IPC는 더 이상 throw하지 않음. 대신 { ok, value | reason+error } 형태.
//   - reason === 'cancelled' → 사용자 의도. 조용히 무시.
//   - 다른 실패 → 사용자에게 알림 (지금은 console.error, 나중에 toast).
//
// 호출만 하면 되는 곳에서는 isOk(result)로 좁히기.

import { useExplorerStore } from '../store/explorer.store';
import { useCommand } from '@shared/hooks';
import { isOk } from '@shared/types/result';

export function useWorkspaceCommands(): void {
  const setTree = useExplorerStore((s) => s.setTree);

  useCommand('workspace.openFolder', async () => {
    const picked = await window.api.workspace.openFolder();
    if (!isOk(picked)) {
      if (picked.reason !== 'cancelled') {
        console.error('[workspace] openFolder failed:', picked.error);
      }
      return;
    }

    const tree = await window.api.workspace.readTree(picked.value);
    if (!isOk(tree)) {
      console.error('[workspace] readTree failed:', tree.error);
      return;
    }
    setTree(tree.value);
  });
}
