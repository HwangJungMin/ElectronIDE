import { editorApi } from '../api/editor.api';
import { terminalApi } from '../api/terminal.api';
import { aiChatApi } from '../api/ai-chat.api';
import { plcApi } from '../api/plc.api';
import { workspaceApi } from '../api/workspace.api';
import { debuggerApi } from '../api/debugger.api';

export const exposedApi = {
  editor: editorApi,
  terminal: terminalApi,
  aiChat: aiChatApi,
  plc: plcApi,
  workspace: workspaceApi,
  debugger: debuggerApi,
};

export type ExposedApi = typeof exposedApi;
