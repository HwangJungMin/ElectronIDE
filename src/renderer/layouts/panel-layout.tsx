import { ChatPanel } from '@features/ai-chat/components/chat-panel';
import { ExplorerPanel } from '@features/explorer/components/explorer-panel';
import { EditorPane } from '@features/editor/components/editor-pane';

export function PanelLayout() {
  return (
    <div className="flex-1 flex">
      <aside className="w-64 border-r border-neutral-800">
        <ExplorerPanel />
      </aside>
      <main className="flex-1 overflow-hidden">
        <EditorPane />
      </main>
      <aside className="w-80 border-l border-neutral-800">
        <ChatPanel />
      </aside>
    </div>
  );
}
