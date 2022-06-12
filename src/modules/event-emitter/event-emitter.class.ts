import { Listener } from "./types/listener.type";

export class EventEmitter {
  private events: Record<string, Listener<unknown>[]> = {};

  public on(name: string, listener: Listener<unknown>) {
    this.events[name] = this.events[name]
      ? [...this.events[name], listener]
      : [listener];
  }

  public off(name: string, listenerToRemove: Listener<unknown>) {
    if (!this.events[name]) {
      throw new Error(`Can't remove listener, event "${name}" doesn't exist`);
    }

    this.events[name] = this.events[name].filter(
      (listener) => listener === listenerToRemove
    );
  }

  public emit(name: string, payload?: unknown) {
    if (!this.events[name]) {
      throw new Error(`Can't emit an event, event "${name}" doesn't exits.`);
    }

    this.events[name].forEach((listener) => listener(payload));
  }
}
