// useEditorCommands: editor 도메인의 커맨드를 등록하는 anchor 훅.
// CommandsHost에서 단 한 번만 호출됨.
//
// 학습 포인트:
//   - 다중 문서 모델이라 커맨드 의미가 살짝 풍부해짐:
//       editor.open(path)        → 열고 활성화 (이미 열려있으면 활성화만)
//       editor.close(path?)      → 그 탭 닫기 (생략 시 활성 탭)
//       editor.closeAll()        → 전부 닫기
//       editor.activate(path)    → 탭 전환
//   - 각 커맨드 끝에 적절한 이벤트 발행 → 외부 청취자(예: AI 패널, 상태바)가 반응 가능.

import { useEditorStore } from '../store/editor.store';
import { useCommand } from '@shared/hooks';
import { eventBus } from '@shared/services/event-bus';

export function useEditorCommands(): void {
  const openFile = useEditorStore((s) => s.openFile);
  const closeDocument = useEditorStore((s) => s.closeDocument);
  const closeAll = useEditorStore((s) => s.closeAll);
  const activate = useEditorStore((s) => s.activate);

  useCommand('editor.open', async (path) => {
    const opened = await openFile(path);
    if (opened) eventBus.emit('file:opened', { path });
  });

  useCommand('editor.close', (path) => {
    const target = path ?? useEditorStore.getState().activePath;
    if (!target) return;
    closeDocument(target);
    eventBus.emit('file:closed', { path: target });
  });

  useCommand('editor.closeAll', () => {
    const paths = [...useEditorStore.getState().documents.keys()];
    closeAll();
    for (const p of paths) eventBus.emit('file:closed', { path: p });
  });

  useCommand('editor.activate', (path) => {
    activate(path);
  });
}
