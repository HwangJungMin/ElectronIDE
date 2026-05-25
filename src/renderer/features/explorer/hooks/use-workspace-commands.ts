// useWorkspaceCommands: workspace 도메인의 커맨드 등록 훅.
//
// 메모: 지금은 explorer feature 안에 두지만, 본격적으로 workspace feature를
// 분리할 때 그 쪽으로 옮길 예정. 위치보다 "한 도메인 = 한 훅" 패턴이 핵심.

import { useExplorerStore } from '../store/explorer.store';
import { useCommand } from '@shared/hooks';

export function useWorkspaceCommands(): void {
  const setTree = useExplorerStore((s) => s.setTree);

  useCommand('workspace.openFolder', async () => {
    const folderPath = await window.api.workspace.openFolder();
    if (!folderPath) return; // 사용자가 취소

    const tree = await window.api.workspace.readTree(folderPath);
    if (tree) setTree(tree);
  });
}
