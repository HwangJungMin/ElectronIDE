import type { ExposedApi } from '../exposed/exposed-api';

declare global {
  interface Window {
    api: ExposedApi;
  }
}

export {};
