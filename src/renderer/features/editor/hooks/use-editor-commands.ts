// useEditorCommands: editor 도메인의 커맨드를 등록하는 훅.
//
// 학습 포인트:
//   1) "컴포넌트 = 살림(렌더)" / "훅 = 행동(부수효과)" 으로 책임 분리.
//      EditorPane은 이제 어떤 IPC도 호출하지 않고, 어떤 커맨드도 직접 등록하지 않음.
//   2) 훅을 호출하는 컴포넌트가 살아있는 동안 커맨드도 등록 상태.
//      EditorPane이 언마운트되면 자동 해제 → 잘못된 핸들러가 남는 일이 없음.
//   3) store 액션은 zustand에서 안정 참조라 deps에 넣지 않아도 안전하지만,
//      useCommand가 ref 패턴이라 deps 자체가 필요 없음.

import { useEditorStore } from '../store/editor.store';
import { useCommand } from '@shared/hooks';
import { eventBus } from '@shared/services/event-bus';

export function useEditorCommands(): void {
  const openFile = useEditorStore((s) => s.openFile);
  const close = useEditorStore((s) => s.close);

  useCommand('editor.open', async (path) => {
    const opened = await openFile(path);
    if (opened) {
      eventBus.emit('file:opened', { path });
    }
  });

  useCommand('editor.close', () => {
    const path = useEditorStore.getState().currentPath;
    close();
    if (path) eventBus.emit('file:closed', { path });
  });
}
