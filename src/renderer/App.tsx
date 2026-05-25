import { Providers } from './app/providers';
import { CommandsHost } from './app/commands-host';
import { IdeLayout } from './layouts/ide-layout';

export function App() {
  return (
    <Providers>
      {/* CommandsHost는 화면을 그리지 않고 도메인 커맨드만 등록.
          IdeLayout보다 먼저 두면 layout 컴포넌트들이 mount 될 때 이미 커맨드가 살아있음. */}
      <CommandsHost />
      <IdeLayout />
    </Providers>
  );
}
