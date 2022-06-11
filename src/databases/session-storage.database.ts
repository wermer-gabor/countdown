import { Todo } from '../todos';
import { Database } from './database.type';

const KEYS = {
  todos: 'todos',
  shouldFilterDoneTodos: 'should-filter-done-todos',
}

export class SessionStorageDatabase implements Database {
  getTodos = async () => JSON.parse(sessionStorage.getItem(KEYS.todos) ?? '[]') as Todo[];
  setTodos = async (todos: Todo[]) => {
    const stringifiedTodos = JSON.stringify(todos);

    sessionStorage.setItem(KEYS.todos, stringifiedTodos);
  };

  getShouldFilterDoneTodos = async () =>  JSON.parse(sessionStorage.getItem(KEYS.shouldFilterDoneTodos) ?? 'false') as boolean;
  setShouldFilterDoneTodos = async (shouldFilterDoneTodos: boolean) => {
    const stringifiedShouldFilterDoneTodos = JSON.stringify(shouldFilterDoneTodos);

    sessionStorage.setItem(KEYS.shouldFilterDoneTodos, stringifiedShouldFilterDoneTodos);
  };

  clear = async () => {
    sessionStorage.clear();
  }
}