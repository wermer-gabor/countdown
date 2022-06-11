import { v4 as getUuid } from "uuid";
import { Database } from "../databases";
import type { Todo } from "./todo.type";

export class TodoList {
  private todos: Todo[] = [];
  private shouldFilterDoneTodos: boolean = false;
  private database: Database | null = null;
  private selectors = {
    todoList: "todo-list",
    addTodo: "add-todo",
    todoListFilter: "todo-list-filter",
  };

  private initialize = async (database: Database | null) => {
    this.database = database;

    this.todos = (await this.database?.getTodos()) ?? [];
    this.shouldFilterDoneTodos =
      (await this.database?.getShouldFilterDoneTodos()) ?? false;
    this.drawTodos(this.todos);

    this.setUpAddTodoInput();
    this.setUpTodoDoneListener();
    this.setUpFilterListener();
  };

  public setDatabase = (database: Database | null) => {
    this.initialize(database);
  };

  public addTodo = async (todo?: string) => {
    let text: string;

    if (!todo) {
      const response = await fetch(
        "https://corporatebs-generator.sameerkumar.website/"
      );
      const { phrase } = await response.json();
      text = phrase;
    } else {
      text = todo;
    }

    this.todos.push({
      id: getUuid(),
      text,
      isDone: false,
    });
    this.database?.setTodos(this.todos);

    this.drawTodos(this.todos);
  };

  private drawTodos = (todos: Todo[]) => {
    const todoList = document.getElementById(this.selectors.todoList);

    if (!todoList) {
      return;
    }

    let html = "";

    const visibleTodos = this.shouldFilterDoneTodos
      ? todos.filter(({ isDone }) => !isDone)
      : todos;

    visibleTodos.forEach(({ id, text, isDone }) => {
      html += `
        <li class="list-group-item" data-todo-id="${id}" role="button">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" role="button" id="${id}" ${
        isDone ? "checked" : ""
      }>
            <label class="form-check-label user-select-none" role="button" for="${id}">
              ${text}
            </label>
          </div>
        </li>
      `;
    });

    todoList.innerHTML =
      html ||
      '<li class="list-group-item user-select-none">You have nothing to do</li>';
  };

  private setUpAddTodoInput = () => {
    let addTodoForm = document.getElementById(
      this.selectors.addTodo
    ) as HTMLFormElement | null;
    addTodoForm?.replaceWith(addTodoForm.cloneNode(true));
    addTodoForm = document.getElementById(
      this.selectors.addTodo
    ) as HTMLFormElement | null;

    const addTodo = this.addTodo;

    addTodoForm?.addEventListener(
      "submit",
      function (this: HTMLFormElement, event) {
        event.preventDefault();

        const text = this.querySelector("input")?.value;

        if (text) {
          addTodo(text);
          this.reset();
        }
      }
    );
  };

  private setUpTodoDoneListener = () => {
    let todoList = document.getElementById(this.selectors.todoList);
    todoList?.replaceWith(todoList.cloneNode(true));
    todoList = document.getElementById(this.selectors.todoList);

    todoList?.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement) {
        const listItem = event.target.closest(
          "li[data-todo-id]"
        ) as HTMLLIElement | null;
        const id = listItem?.dataset.todoId;

        for (const todo of this.todos) {
          if (todo.id === id) {
            todo.isDone = !todo.isDone;
            break;
          }
        }

        this.drawTodos(this.todos);
      }
    });
  };

  private setUpFilterListener = () => {
    let todoListFilter = document.getElementById(
      this.selectors.todoListFilter
    ) as HTMLInputElement | null;
    todoListFilter?.replaceWith(todoListFilter.cloneNode(true));
    todoListFilter = document.getElementById(
      this.selectors.todoListFilter
    ) as HTMLInputElement | null;

    if (todoListFilter) {
      todoListFilter.checked = this.shouldFilterDoneTodos;
    }

    todoListFilter?.addEventListener("change", () => {
      this.shouldFilterDoneTodos = !this.shouldFilterDoneTodos;

      this.database?.setShouldFilterDoneTodos(this.shouldFilterDoneTodos);

      this.drawTodos(this.todos);
    });
  };
}
