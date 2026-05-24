// Event Bus: "이게 일어났다" (수동적/알림, 1 publisher → N listeners, 반환값 없음)
//
// 학습 포인트:
//   1) Set으로 리스너 보관 → 같은 함수 두 번 add해도 1번만 들어감
//   2) on()은 unsubscribe 함수 반환 → useEffect cleanup과 결합
//   3) emit 시 한 리스너가 throw해도 다른 리스너에는 영향 없도록 try/catch
//   4) Command와 달리 "들을 사람이 없어도 정상" — emit해도 listener 0이면 그냥 무시.

export interface EventMap {
  'file:opened': { path: string };
  'file:closed': { path: string };
}

type EventName = keyof EventMap;
type EventListener<K extends EventName> = (payload: EventMap[K]) => void;

class EventBus {
  private listeners = new Map<EventName, Set<(payload: never) => void>>();

  on<K extends EventName>(name: K, listener: EventListener<K>): () => void {
    let set = this.listeners.get(name);
    if (!set) {
      set = new Set();
      this.listeners.set(name, set);
    }
    set.add(listener as (payload: never) => void);
    return () => {
      set!.delete(listener as (payload: never) => void);
      if (set!.size === 0) this.listeners.delete(name);
    };
  }

  emit<K extends EventName>(name: K, payload: EventMap[K]): void {
    const set = this.listeners.get(name);
    if (!set) return;
    for (const listener of set) {
      try {
        (listener as EventListener<K>)(payload);
      } catch (err) {
        console.error(`[event-bus] listener error for "${name}":`, err);
      }
    }
  }
}

export const eventBus = new EventBus();
