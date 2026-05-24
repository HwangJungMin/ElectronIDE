import { invoke } from '../utils/ipc-wrapper';

export const workspaceApi = {
  open: () => invoke('workspace:open'),
};
