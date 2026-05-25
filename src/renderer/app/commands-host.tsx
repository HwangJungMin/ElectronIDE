// CommandsHost: 도메인 커맨드 등록의 "유일한 앵커".
//
// 학습 포인트 — anchor 훅 패턴:
//   useEditorCommands / useWorkspaceCommands는 commandRegistry(전역 싱글톤)에
//   핸들러를 꽂는다. 두 컴포넌트가 같은 anchor 훅을 호출하면 register가 덮어쓰기
//   되어 "마지막 마운트가 이긴다" 식 order-dependent 버그가 생긴다.
//
//   해결: 앱 트리 어딘가 한 곳에서만 호출하도록 "host" 컴포넌트를 따로 둔다.
//   - 화면에는 아무것도 그리지 않음 (return null)
//   - 라이프사이클은 React 안에 있어서 store 액션을 closure로 자연스럽게 잡음
//   - 새 도메인 커맨드 묶음 추가 시 이 파일에 use*Commands() 한 줄 추가
//
//   다른 UI 컴포넌트(EditorPane, ExplorerPanel, 메뉴, 키바인딩 등)는
//   commandRegistry.execute('...') 만 호출 → 단방향 입력 경로 보장.

import { useEditorCommands } from '@features/editor/hooks/use-editor-commands';
import { useWorkspaceCommands } from '@features/explorer/hooks/use-workspace-commands';

export function CommandsHost() {
  useEditorCommands();
  useWorkspaceCommands();
  return null;
}
