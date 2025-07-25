export type EventManagerListener<T> = (payload: T | null) => void;

export interface IEventManager<T> {
  listeners: Map<string, EventManagerListener<T>[]>;
  emit(event: string, payload: T | null): void;
  on(event: string, listener: EventManagerListener<T>): void;
  removeListener(
    event: string,
    listenerToRemove: EventManagerListener<T>
  ): void;
}

export class EventManager<T> implements IEventManager<T> {
  public readonly listeners: Map<string, EventManagerListener<T>[]>;

  constructor() {
    this.listeners = new Map();
  }

  on(event: string, listener: EventManagerListener<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  emit(event: string, payload: T | null) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.forEach((listener: EventManagerListener<T>) => {
      listener(payload);
    });
  }

  removeListener(event: string, listenerToRemove: EventManagerListener<T>) {
    const listeners = this.listeners.get(event);
    if (!listeners) return;
    const filteredListeners = listeners.filter(
      (listener: EventManagerListener<T>) => listener !== listenerToRemove
    );
    this.listeners.set(event, filteredListeners);
  }
}
