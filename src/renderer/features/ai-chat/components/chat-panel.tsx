// 컨테이너는 store를 직접 참조하지 않는다.
// 자식 컴포넌트(MessageList, MessageInput)가 각자 필요한 부분만 구독하도록 분리.

import { MessageList } from './message-list';
import { MessageInput } from './message-input';

export function ChatPanel() {
  return (
    <div className="flex flex-col h-full">
      <header className="px-3 py-2 border-b border-neutral-800 text-sm font-semibold">
        AI Chat
      </header>
      <MessageList />
      <MessageInput />
    </div>
  );
}
