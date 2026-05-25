// Command Registry: "이걸 해라" (능동적, 1 caller → 1 handler, 반환값 있음)
//
// 학습 포인트:
//   1) CommandMap을 타입으로 선언 → execute/register 양쪽 모두 자동완성 + 타입 체크
//   2) register는 unregister 함수를 반환 → useEffect cleanup과 자연스럽게 결합
//   3) execute는 핸들러가 없으면 throw → 누락을 조용히 묻지 않음 (의도적 fail-fast)
//   4) 핸들러는 1개 (Map). 같은 커맨드를 두 번 register하면 후자가 덮어씀.
//      → 이벤트 버스(N개 리스너)와의 가장 큰 차이.

export interface CommandMap {
  'editor.open': { args: [path: string]; return: Promise<void> };
  'editor.close': { args: [path?: string]; return: void }; // path 생략 시 활성 탭
  'editor.closeAll': { args: []; return: void };
  'editor.activate': { args: [path: string]; return: void };
  'workspace.openFolder': { args: []; return: Promise<void> };
}

type CommandName = keyof CommandMap;
type CommandHandler<K extends CommandName> = (
  ...args: CommandMap[K]['args']
) => CommandMap[K]['return'];

class CommandRegistry {
  private handlers = new Map<CommandName, (...args: unknown[]) => unknown>();

  register<K extends CommandName>(name: K, handler: CommandHandler<K>): () => void {
    // 중복 등록 가드: 같은 커맨드를 두 군데서 등록하면 "마지막이 이김"이라
    // order-dependent 버그가 생긴다. dev에선 즉시 잡히도록 경고.
    // (anchor 훅 패턴이 깨졌다는 신호 — CommandsHost 외에서 use*Commands를 부르고 있는 것)
    if (this.handlers.has(name)) {
      console.warn(
        `[command-registry] "${name}" already registered — overwriting. ` +
          'anchor 훅이 두 곳에서 호출되고 있을 가능성. CommandsHost를 확인하세요.',
      );
    }
    this.handlers.set(name, handler as never);
    return () => {
      // 등록 시점의 handler와 같은 경우에만 제거 (재등록 후 cleanup이 새 핸들러를 지우는 사고 방지)
      if (this.handlers.get(name) === (handler as never)) {
        this.handlers.delete(name);
      }
    };
  }

  execute<K extends CommandName>(
    name: K,
    ...args: CommandMap[K]['args']
  ): CommandMap[K]['return'] {
    const handler = this.handlers.get(name) as CommandHandler<K> | undefined;
    if (!handler) {
      throw new Error(`Command not registered: ${name}`);
    }
    return handler(...args);
  }

  has(name: CommandName): boolean {
    return this.handlers.has(name);
  }
}

export const commandRegistry = new CommandRegistry();
