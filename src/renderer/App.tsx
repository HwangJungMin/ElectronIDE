import { Providers } from './app/providers';
import { IdeLayout } from './layouts/ide-layout';

export function App() {
  return (
    <Providers>
      <IdeLayout />
    </Providers>
  );
}
