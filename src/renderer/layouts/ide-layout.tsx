import { ToolbarLayout } from './toolbar-layout';
import { DockingLayout } from './docking-layout';
import { StatusbarLayout } from './statusbar-layout';

export function IdeLayout() {
  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-900 text-neutral-100">
      <ToolbarLayout />
      <DockingLayout />
      <StatusbarLayout />
    </div>
  );
}
