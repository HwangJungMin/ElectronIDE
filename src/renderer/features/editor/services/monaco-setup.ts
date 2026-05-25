// Monaco worker 환경 설정 — main.tsx에서 단 한 번 import.
//
// 학습 포인트:
//   Monaco는 syntax tokenization, JSON/TS/CSS validation 등을 Web Worker에서 돌림.
//   브라우저/렌더러 메인 스레드를 막지 않기 위함.
//
//   Vite에서 worker를 번들로 만드는 방법: `import X from 'path?worker'`
//   각 worker는 별도 청크로 빌드되고, `new X()`로 인스턴스화하면 됨.
//
//   self.MonacoEnvironment.getWorker(_, label)에 등록 — Monaco가 언어별로
//   필요한 워커를 label로 요청함. 없는 label은 기본 editor.worker로 폴백.
//
//   주의: 이 모듈은 사이드이펙트만 있고 export가 없음. main.tsx에서 `import './...'`
//   형태로 임포트해서 부팅 시 1회 실행 보장.

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    switch (label) {
      case 'json':
        return new jsonWorker();
      case 'css':
      case 'scss':
      case 'less':
        return new cssWorker();
      case 'html':
      case 'handlebars':
      case 'razor':
        return new htmlWorker();
      case 'typescript':
      case 'javascript':
        return new tsWorker();
      default:
        return new editorWorker();
    }
  },
};
