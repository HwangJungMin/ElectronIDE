import { createHashRouter, RouterProvider } from 'react-router-dom';
import { IdeLayout } from '../layouts/ide-layout';

const router = createHashRouter([{ path: '/', element: <IdeLayout /> }]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
