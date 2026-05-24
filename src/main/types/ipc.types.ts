export interface IpcRequest<T = unknown> {
  channel: string;
  payload: T;
}

export interface IpcResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}
