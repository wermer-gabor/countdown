import { Todo } from "../todos";

export type Database = {
  getTodos: () => Promise<Todo[]>;
  setTodos: (todos: Todo[]) => Promise<void>;

  getShouldFilterDoneTodos: () => Promise<boolean>;
  setShouldFilterDoneTodos: (shouldFilterDoneTodos: boolean) => Promise<void>

  clear: () => Promise<void>
};
