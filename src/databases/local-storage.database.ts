import { Todo } from '../todos';
import { Database } from './database.type';

const KEYS = {
  todos: 'todos',
  shouldFilterDoneTodos: 'should-filter-done-todos',
}

export class LocalStorageDatabase implements Database {
  getTodos = async () => JSON.parse(localStorage.getItem(KEYS.todos) ?? '[]') as Todo[];
  setTodos = async (todos: Todo[]) => {
    const stringifiedTodos = JSON.stringify(todos);

    localStorage.setItem(KEYS.todos, stringifiedTodos);
  };

  getShouldFilterDoneTodos = async () =>  JSON.parse(localStorage.getItem(KEYS.shouldFilterDoneTodos) ?? 'false') as boolean;
  setShouldFilterDoneTodos = async (shouldFilterDoneTodos: boolean) => {
    const stringifiedShouldFilterDoneTodos = JSON.stringify(shouldFilterDoneTodos);

    localStorage.setItem(KEYS.shouldFilterDoneTodos, stringifiedShouldFilterDoneTodos);
  };

  clear = async () => {
    Object.values(KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}