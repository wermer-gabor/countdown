import { EventEmitter, Listener } from "../../event-emitter";
import { TodoType } from "../../todo-list/types/todo.type";
import { DatabaseType } from "../types/database.type";

const KEYS = {
  todos: "todos",
  shouldFilterDoneTodos: "should-filter-done-todos",
  busynessFrequency: "busyness-frequency",
};

export class LocalStorageDatabase implements DatabaseType {
  private static EVENTS = {
    DATABASE_CLEARED: "database-cleared",
  };
  private emitter = new EventEmitter();

  public getTodos = async () =>
    JSON.parse(localStorage.getItem(KEYS.todos) ?? "[]") as TodoType[];
  setTodos = async (todos: TodoType[]) => {
    const stringifiedTodos = JSON.stringify(todos);

    localStorage.setItem(KEYS.todos, stringifiedTodos);
  };

  public getShouldFilterDoneTodos = async () =>
    JSON.parse(
      localStorage.getItem(KEYS.shouldFilterDoneTodos) ?? "false"
    ) as boolean;
  public setShouldFilterDoneTodos = async (shouldFilterDoneTodos: boolean) => {
    const stringifiedShouldFilterDoneTodos = JSON.stringify(
      shouldFilterDoneTodos
    );

    localStorage.setItem(
      KEYS.shouldFilterDoneTodos,
      stringifiedShouldFilterDoneTodos
    );
  };

  public getBusynessFrequency = async () =>
    +JSON.parse(localStorage.getItem(KEYS.busynessFrequency) ?? "0");
  public setBusynessFrequency = async (busynessFrequency: number) => {
    localStorage.setItem(KEYS.busynessFrequency, busynessFrequency.toString());
  };

  public clear = async () => {
    Object.values(KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    this.emitter.emit(LocalStorageDatabase.EVENTS.DATABASE_CLEARED);
  };
  public onClear = (listener: Listener) => {
    this.emitter.on(LocalStorageDatabase.EVENTS.DATABASE_CLEARED, listener);
  };

  public destory = () => {
    this.emitter = new EventEmitter();
  };
}
