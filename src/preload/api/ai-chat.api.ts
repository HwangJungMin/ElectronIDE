import { invoke } from '../utils/ipc-wrapper';

export const aiChatApi = {
  send: (message: string) => invoke('ai:send', message),
};
