// renderer에서 window.api를 타입 안전하게 사용하기 위한 전역 선언.
//
// 왜 여기에 또 정의? — renderer와 preload는 별도 번들이라 tsconfig가 분리됨.
// preload의 ExposedApi 타입을 그대로 import 하려면 tsconfig.web.json의 include 범위를
// preload까지 넓혀야 하는데, 그럼 preload의 runtime electron import(ipcRenderer 등)도
// 끌려와 renderer의 type check가 깨짐.
//
// → 트레이드오프: 약간의 중복을 감수하고 renderer-side에서 contract를 다시 선언.
// 실무에선 codegen이나 별도 shared-types 패키지로 해결.

export interface FileNode {
  path: string;
  name: string;
  isDirectory: boolean;
  children?: FileNode[];
}

declare global {
  interface Window {
    api: {
      editor: {
        readFile: (path: string) => Promise<string>;
        writeFile: (path: string, content: string) => Promise<void>;
      };
      workspace: {
        openFolder: () => Promise<string | null>;
        readTree: (rootPath: string) => Promise<FileNode | null>;
      };
      terminal: {
        spawn: () => Promise<unknown>;
      };
      aiChat: {
        send: (message: string) => Promise<unknown>;
      };
      plc: {
        connect: () => Promise<unknown>;
      };
      debugger: {
        start: () => Promise<unknown>;
      };
    };
  }
}
