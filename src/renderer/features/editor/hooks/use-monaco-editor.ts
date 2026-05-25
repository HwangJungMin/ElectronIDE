// useMonacoEditor: Monaco editor 인스턴스의 라이프사이클을 React 훅으로 캡슐화.
//
// === 학습 포인트 (반드시 이해할 것) ===
//
// 1) Monaco는 React가 모르는 DOM을 점유한다.
//    monaco.editor.create(container)를 호출하면 그 div 안에 자기 DOM 트리를 깐다.
//    → React가 다시 그 div의 자식을 건드리면 Monaco가 망가짐.
//    → 컨테이너 div는 비어있게 두고, ref만 Monaco에게 넘긴다.
//
// 2) "에디터 인스턴스"와 "모델(파일 내용 + URI + 언어 + 히스토리)"은 분리된 개념.
//    - editor.create는 인스턴스 1개를 만들고
//    - 그 인스턴스에 model을 setModel으로 갈아끼우면 다른 파일을 보여준다.
//    - 파일별로 별도 model을 두면 undo 히스토리/스크롤 위치가 보존됨.
//    오늘은 단일 파일이지만 모델 분리 패턴을 미리 적용해서 나중에 탭으로 확장 쉽게.
//
// 3) StrictMode는 effect를 mount → cleanup → mount 두 번 실행한다.
//    → cleanup에서 editor.dispose() + model.dispose() 누락 시 메모리 누수 + 중복 인스턴스.
//
// 4) 외부 value 변경과 사용자 입력의 충돌:
//    setValue가 onDidChangeModelContent를 발화시켜 무한 루프 가능.
//    → settingValueRef 플래그 + 값 비교(value === modelValue)로 방지.
//
// 5) onChange는 ref로 추적.
//    호출자가 매 렌더에 새 onChange 함수를 줘도 구독을 다시 만들지 않기 위함.

import { useEffect, useLayoutEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface UseMonacoEditorOptions {
  path: string | null;
  value: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export function useMonacoEditor(options: UseMonacoEditorOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const modelsRef = useRef<Map<string, monaco.editor.ITextModel>>(new Map());
  const settingValueRef = useRef(false);
  const onChangeRef = useRef(options.onChange);

  useLayoutEffect(() => {
    onChangeRef.current = options.onChange;
  });

  // (A) 인스턴스 생성 — 마운트 시 1회, 언마운트 시 dispose.
  useEffect(() => {
    if (!containerRef.current) return;

    const editor = monaco.editor.create(containerRef.current, {
      value: '',
      automaticLayout: true, // 컨테이너 크기 변화에 자동 대응. 다중 에디터에선 ResizeObserver로 대체 고려.
      theme: 'vs-dark',
      fontSize: 13,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      readOnly: options.readOnly ?? false,
    });
    editorRef.current = editor;

    const sub = editor.onDidChangeModelContent(() => {
      // 외부에서 setValue 중이면 무시 — 무한 루프 방지.
      if (settingValueRef.current) return;
      onChangeRef.current?.(editor.getValue());
    });

    return () => {
      sub.dispose();
      editor.dispose();
      for (const m of modelsRef.current.values()) m.dispose();
      modelsRef.current.clear();
      editorRef.current = null;
    };
    // readOnly는 의도적으로 deps에서 제외 — 변경 효과는 (D) 별도 effect에서 처리.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (B) path 변경 → 해당 파일용 model로 교체.
  // 같은 path는 모델 캐시에서 재사용 → undo 히스토리 보존.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !options.path) return;

    let model = modelsRef.current.get(options.path);
    if (!model || model.isDisposed()) {
      const uri = monaco.Uri.file(options.path);
      // 다른 곳에서 같은 URI로 만든 model이 살아있으면 그걸 재사용.
      const existing = monaco.editor.getModel(uri);
      model = existing ?? monaco.editor.createModel(options.value, options.language, uri);
      modelsRef.current.set(options.path, model);
    }
    editor.setModel(model);
  }, [options.path, options.language, options.value]);

  // (C) value 외부 변경 → model에 반영.
  // 사용자가 직접 친 경우엔 이미 model.value가 옵션과 같아서 no-op이 됨.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;
    if (model.getValue() === options.value) return;

    settingValueRef.current = true;
    try {
      // pushEditOperations로도 가능하지만 (undo 히스토리에 들어감) 외부 동기화에선
      // setValue가 의도에 맞음 — "이건 외부 상태야, 너의 편집과 무관해".
      model.setValue(options.value);
    } finally {
      settingValueRef.current = false;
    }
  }, [options.value]);

  // (D) language 변경 → model 언어 교체.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !options.language) return;
    const model = editor.getModel();
    if (model) monaco.editor.setModelLanguage(model, options.language);
  }, [options.language]);

  // (E) readOnly 토글.
  useEffect(() => {
    editorRef.current?.updateOptions({ readOnly: options.readOnly ?? false });
  }, [options.readOnly]);

  return { containerRef };
}
