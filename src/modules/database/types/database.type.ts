import { Listener } from "../../event-emitter";
import { Todo } from "../../todo-list";

export type DatabaseType = {
  getTodos: () => Promise<Todo[]>;
  setTodos: (todos: Todo[]) => Promise<void>;

  getShouldFilterDoneTodos: () => Promise<boolean>;
  setShouldFilterDoneTodos: (shouldFilterDoneTodos: boolean) => Promise<void>;

  getBusynessFrequency: () => Promise<number>;
  setBusynessFrequency: (busynessFrequency: number) => Promise<void>;

  clear: () => Promise<void>;
  onClear: (listener: Listener) => void;

  destory: () => void;
};
