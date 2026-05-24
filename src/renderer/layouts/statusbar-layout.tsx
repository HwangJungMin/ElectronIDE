// Event Bus 청취 패턴:
//   - 누가 'file:opened'를 발행하든 statusbar는 들을 수 있음
//   - editor가 이 statusbar의 존재를 알 필요 X
//   - 나중에 또 다른 listener (예: recent files, git status)가 추가돼도 editor는 그대로
//
// 비교: 만약 직접 구독으로 했다면, statusbar가 editor.store를 import해야 함
//       → editor가 statusbar의 의존성이 됨

import { useEffect, useState } from 'react';
import { eventBus } from '@shared/services/event-bus';

export function StatusbarLayout() {
  const [openPath, setOpenPath] = useState<string | null>(null);

  useEffect(() => {
    const offOpen = eventBus.on('file:opened', ({ path }) => setOpenPath(path));
    const offClose = eventBus.on('file:closed', () => setOpenPath(null));
    return () => {
      offOpen();
      offClose();
    };
  }, []);

  return (
    <footer className="h-6 px-2 text-xs flex items-center justify-between bg-neutral-950 border-t border-neutral-800 text-neutral-400">
      <span className="truncate">{openPath ? `open: ${openPath}` : 'Ready'}</span>
      <span className="text-neutral-600 ml-2">via event-bus</span>
    </footer>
  );
}
