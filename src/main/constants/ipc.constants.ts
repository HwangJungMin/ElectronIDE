export const IPC_CHANNELS = {
  EDITOR_OPEN_FILE: 'editor:open-file',
  EDITOR_SAVE_FILE: 'editor:save-file',
  TERMINAL_SPAWN: 'terminal:spawn',
  AI_SEND: 'ai:send',
  PLC_CONNECT: 'plc:connect',
  WORKSPACE_OPEN: 'workspace:open',
  DEBUGGER_START: 'debugger:start',
  SYSTEM_VERSION: 'system:version',
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
