// 액션은 reference가 안 바뀌므로 셀렉터로 가져와도 안전 (리렌더 트리거 X)
// state 값(input, isStreaming)은 바뀔 때마다 이 컴포넌트만 리렌더

import { useAiChatStore } from '../store/ai-chat.store';

export function MessageInput() {
  const input = useAiChatStore((s) => s.input);
  const isStreaming = useAiChatStore((s) => s.isStreaming);
  const setInput = useAiChatStore((s) => s.setInput);
  const addMessage = useAiChatStore((s) => s.addMessage);
  const setStreaming = useAiChatStore((s) => s.setStreaming);
  const clear = useAiChatStore((s) => s.clear);

  const handleSend = () => {
    const content = input.trim();
    if (!content || isStreaming) return;

    addMessage({ role: 'user', content });
    setInput('');

    // LLM 연결 전이라 setTimeout으로 가짜 응답을 만들어 store 흐름을 눈으로 확인
    setStreaming(true);
    setTimeout(() => {
      addMessage({ role: 'assistant', content: `echo: ${content}` });
      setStreaming(false);
    }, 800);
  };

  return (
    <div className="border-t border-neutral-800 p-2 space-y-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="메시지 입력 (Enter 전송, Shift+Enter 줄바꿈)"
        rows={3}
        disabled={isStreaming}
        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm text-neutral-100 placeholder-neutral-500 resize-none focus:outline-none focus:border-blue-500 disabled:opacity-50"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:text-neutral-500 rounded text-sm"
        >
          전송
        </button>
        <button
          onClick={clear}
          className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
