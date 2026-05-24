// Zustand store pattern: explorer.store.ts와 동일한 구조.
// 차이점:
//   - addMessage가 set((state) => ...) 형태로 "이전 상태를 읽고 새 상태를 반환"하는 함수형 업데이트를 사용 (배열 append)
//   - id/timestamp는 액션 내부에서 생성하므로 호출자는 role/content만 넘기면 됨

import { create } from 'zustand';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

interface AiChatState {
  messages: ChatMessage[];
  input: string;
  isStreaming: boolean;
}

interface AiChatActions {
  addMessage: (msg: Pick<ChatMessage, 'role' | 'content'>) => void;
  setInput: (value: string) => void;
  setStreaming: (value: boolean) => void;
  clear: () => void;
}

const initialState: AiChatState = {
  messages: [],
  input: '',
  isStreaming: false,
};

export const useAiChatStore = create<AiChatState & AiChatActions>((set) => ({
  ...initialState,

  addMessage: ({ role, content }) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: crypto.randomUUID(), role, content, createdAt: Date.now() },
      ],
    })),

  setInput: (input) => set({ input }),

  setStreaming: (isStreaming) => set({ isStreaming }),

  clear: () => set(initialState),
}));
