import { invoke } from '../utils/ipc-wrapper';

export const terminalApi = {
  spawn: () => invoke('terminal:spawn'),
};
