import { invoke } from '../utils/ipc-wrapper';

export const debuggerApi = {
  start: () => invoke('debugger:start'),
};
