// 셀렉터로 필요한 값만 구독 → 다른 값이 바뀌어도 이 컴포넌트는 리렌더되지 않음
//   예: input 글자만 바뀌어도 MessageList는 리렌더 X (messages/isStreaming만 본다)

import { useAiChatStore } from '../store/ai-chat.store';

export function MessageList() {
  const messages = useAiChatStore((s) => s.messages);
  const isStreaming = useAiChatStore((s) => s.isStreaming);

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-neutral-500 p-4">
        메시지가 없습니다. 아래에 입력해 보세요.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={
            msg.role === 'user'
              ? 'bg-blue-900/30 border border-blue-700/40 rounded p-2 text-sm'
              : 'bg-neutral-800 border border-neutral-700 rounded p-2 text-sm'
          }
        >
          <div className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
            {msg.role}
          </div>
          <div className="whitespace-pre-wrap text-neutral-100">{msg.content}</div>
        </div>
      ))}
      {isStreaming && (
        <div className="text-xs text-neutral-500 italic px-1">assistant is typing…</div>
      )}
    </div>
  );
}
