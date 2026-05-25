// useEventBus: eventBus.on을 React 라이프사이클에 묶는 공용 훅.
//
// 동일한 ref 패턴 사용 — 자세한 이유는 use-command.ts의 주석 참고.
//
// Command와의 차이를 다시 한 번:
//   - useCommand 는 "내가 이 명령의 유일한 수행자다" (덮어쓰기 가능)
//   - useEventBus 는 "이 이벤트가 발생하면 알려달라" (N개 동시 청취)
//   → 같은 이벤트를 두 컴포넌트가 useEventBus 하면 둘 다 호출됨.

import { useEffect, useLayoutEffect, useRef } from 'react';
import { eventBus, type EventMap } from '../services/event-bus';

type EventName = keyof EventMap;
type EventListener<K extends EventName> = (payload: EventMap[K]) => void;

export function useEventBus<K extends EventName>(
  name: K,
  listener: EventListener<K>,
): void {
  const listenerRef = useRef(listener);

  useLayoutEffect(() => {
    listenerRef.current = listener;
  });

  useEffect(() => {
    const stable: EventListener<K> = (payload) => listenerRef.current(payload);
    return eventBus.on(name, stable);
  }, [name]);
}
