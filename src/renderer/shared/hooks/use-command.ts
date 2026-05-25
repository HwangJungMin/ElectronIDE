// useCommand: commandRegistry.register를 React 라이프사이클에 묶는 공용 훅.
//
// 학습 포인트 — 왜 ref 패턴을 쓰는가:
//   순진하게 짜면 다음과 같음:
//
//     useEffect(() => {
//       const off = commandRegistry.register(name, handler);
//       return off;
//     }, [name, handler]);
//
//   문제: handler를 매 렌더에서 인라인 함수로 만들면 deps가 매번 바뀜
//        → register/unregister가 매 렌더마다 발생 → 깜빡거림 + race.
//   해결책 A: 호출자가 useCallback으로 직접 메모이즈 (오용 쉬움)
//   해결책 B (여기서 채택): ref에 최신 handler를 담아두고, register는 [name]에만 의존.
//        호출자가 매 렌더에서 새 함수를 줘도 register는 1회만, ref만 매번 최신화.
//
// 왜 useLayoutEffect로 ref를 동기화? — useEffect는 paint 후에 실행되므로,
// 같은 commit 안에서 발생한 synchronous execute가 이전 ref를 볼 수 있음.
// useLayoutEffect는 commit 직후 paint 전에 실행되므로 안전.

import { useEffect, useLayoutEffect, useRef } from 'react';
import { commandRegistry, type CommandMap } from '../services/command-registry';

type CommandName = keyof CommandMap;
type CommandHandler<K extends CommandName> = (
  ...args: CommandMap[K]['args']
) => CommandMap[K]['return'];

export function useCommand<K extends CommandName>(
  name: K,
  handler: CommandHandler<K>,
): void {
  const handlerRef = useRef(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    // ref를 통해 호출되는 안정적인 wrapper. 진짜 등록 함수는 매번 같지만,
    // 내부에서 ref.current로 항상 최신 핸들러를 호출함.
    const stable = ((...args: CommandMap[K]['args']) =>
      handlerRef.current(...args)) as CommandHandler<K>;
    return commandRegistry.register(name, stable);
  }, [name]);
}
