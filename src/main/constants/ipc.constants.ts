// IPC 채널 이름은 main/preload 양쪽에서 일치해야 함.
// 상수로 빼두면 오타로 인한 silent fail 방지 + rename 용이.

export const IPC_CHANNELS = {
  EDITOR_READ_FILE: 'editor:read-file',
  EDITOR_WRITE_FILE: 'editor:write-file',
  TERMINAL_SPAWN: 'terminal:spawn',
  AI_SEND: 'ai:send',
  PLC_CONNECT: 'plc:connect',
  WORKSPACE_OPEN_FOLDER: 'workspace:open-folder',
  WORKSPACE_READ_TREE: 'workspace:read-tree',
  DEBUGGER_START: 'debugger:start',
  SYSTEM_VERSION: 'system:version',
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
