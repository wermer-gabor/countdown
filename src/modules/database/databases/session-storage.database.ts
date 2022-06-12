import { EventEmitter, Listener } from "../../event-emitter";
import { TodoType } from "../../todo-list/types/todo.type";
import { DatabaseType } from "../types/database.type";

const KEYS = {
  todos: "todos",
  shouldFilterDoneTodos: "should-filter-done-todos",
  busynessFrequency: "busyness-frequency",
};

export class SessionStorageDatabase implements DatabaseType {
  private static EVENTS = {
    DATABASE_CLEARED: "database-cleared",
  };
  private emitter = new EventEmitter();

  getTodos = async () =>
    JSON.parse(sessionStorage.getItem(KEYS.todos) ?? "[]") as TodoType[];
  setTodos = async (todos: TodoType[]) => {
    const stringifiedTodos = JSON.stringify(todos);

    sessionStorage.setItem(KEYS.todos, stringifiedTodos);
  };

  getShouldFilterDoneTodos = async () =>
    JSON.parse(
      sessionStorage.getItem(KEYS.shouldFilterDoneTodos) ?? "false"
    ) as boolean;
  setShouldFilterDoneTodos = async (shouldFilterDoneTodos: boolean) => {
    const stringifiedShouldFilterDoneTodos = JSON.stringify(
      shouldFilterDoneTodos
    );

    sessionStorage.setItem(
      KEYS.shouldFilterDoneTodos,
      stringifiedShouldFilterDoneTodos
    );
  };

  public getBusynessFrequency = async () =>
    +JSON.parse(sessionStorage.getItem(KEYS.busynessFrequency) ?? "0");
  public setBusynessFrequency = async (busynessFrequency: number) => {
    sessionStorage.setItem(
      KEYS.busynessFrequency,
      busynessFrequency.toString()
    );
  };

  clear = async () => {
    sessionStorage.clear();
    this.emitter.emit(SessionStorageDatabase.EVENTS.DATABASE_CLEARED);
  };
  public onClear = (listener: Listener) => {
    this.emitter.on(SessionStorageDatabase.EVENTS.DATABASE_CLEARED, listener);
  };

  public destory = () => {
    this.emitter = new EventEmitter();
  };
}
