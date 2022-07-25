import { v4 as getUuid } from "uuid";

import { SelectedDatabase, DatabaseType } from "../../database";
import { TodoType } from "../types/todo.type";

export class TodoListComponent {
  private selectedDatabase: SelectedDatabase;

  private todos: TodoType[] = [];

  private filters = {
    done: false,
  };

  private container: HTMLElement;
  private selectors = {
    todoList: "todo-list",
    addTodoForm: "add-todo-form",
    todoListDoneFilter: "todo-list-done-filter",
  };

  private lastClickedTodoItemIndex: number | null = null;

  constructor({
    containerId,
    selectedDatabase,
  }: {
    containerId: string;
    selectedDatabase: SelectedDatabase;
  }) {
    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error(`Couldn't find container by id: ${containerId}`);
    }

    this.container = container;
    this.selectedDatabase = selectedDatabase;
  }

  public initialize = () => {
    this.handleDatabaseChange();
    this.selectedDatabase.onDatabaseChange(this.handleDatabaseChange);
  };

  private handleDatabaseChange = () => {
    this.syncDatabase().then(() => {
      this.drawTodos();

      this.setUpListeners();
      this.selectedDatabase.database?.onClear(this.handleDatabaseChange);
    });
  };

  private syncDatabase = async () => {
    this.todos = (await this.selectedDatabase.database?.getTodos()) ?? [];

    this.filters.done =
      (await this.selectedDatabase.database?.getShouldFilterDoneTodos()) ??
      false;
  };

  private setUpListeners = () => {
    this.setUpAddTodoInputListener();
    this.setUpTodoDoneListener();
    this.setUpFilterListener();
  };

  public addTodo = async (todo?: string) => {
    const currentDatabase = this.selectedDatabase.database;

    let text: string;

    if (!todo) {
      const response = await fetch(
        "https://corporatebs-generator.sameerkumar.website/"
      );
      const { phrase } = await response.json();
      text = phrase;
    } else if (this.todos.some(({ text }) => text === todo)) {
      return;
    } else {
      text = todo;
    }

    if (currentDatabase === this.selectedDatabase.database) {
      this.todos.push({
        id: getUuid(),
        text,
        isDone: false,
      });

      this.selectedDatabase.database?.setTodos(this.todos);

      this.drawTodos();
    }
  };

  private drawTodos = () => {
    const todoList = this.container.querySelector(
      `#${this.selectors.todoList}`
    );

    if (todoList) {
      let html = "";

      let visibleTodos = this.todos;

      if (this.filters.done) {
        visibleTodos = this.todos.filter(({ isDone }) => !isDone);
      }

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

      const noTodosMessage =
        '<li class="list-group-item user-select-none">You have nothing to do</li>';

      todoList.innerHTML = html || noTodosMessage;
    }
  };

  private setUpAddTodoInputListener = () => {
    let addTodoForm = this.container.querySelector(
      `#${this.selectors.addTodoForm}`
    ) as HTMLFormElement | null;
    // Remove previous event listeners
    addTodoForm?.replaceWith(addTodoForm.cloneNode(true));
    addTodoForm = this.container.querySelector(
      `#${this.selectors.addTodoForm}`
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
    let todoList = this.container.querySelector(`#${this.selectors.todoList}`);
    // Remove previous event listeners
    todoList?.replaceWith(todoList.cloneNode(true));
    todoList = this.container.querySelector(`#${this.selectors.todoList}`);

    this.lastClickedTodoItemIndex = null;

    todoList?.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement && event instanceof MouseEvent) {
        const listItem = event.target.closest(
          "li[data-todo-id]"
        ) as HTMLLIElement | null;

        const id = listItem?.dataset.todoId;
        if (id) {
          const todoIndex = this.todos.findIndex((todo) => todo.id === id);
          const min = Math.min(this.lastClickedTodoItemIndex ?? 0, todoIndex)
          const max = Math.max(this.lastClickedTodoItemIndex ?? 0, todoIndex)

          for (let index = 0; index < this.todos.length; index++) {
            const todo = this.todos[index];

            if(event.shiftKey && this.lastClickedTodoItemIndex !== null) {
              if (index > min && index < max || index === todoIndex) {
                todo.isDone = !todo.isDone;
              }
            } else {
              if(todoIndex === index) {
                todo.isDone = !todo.isDone;
                break;
              }
            }
          }

          this.lastClickedTodoItemIndex = todoIndex;

          this.drawTodos();
        }
      }
    });
  };

  private setUpFilterListener = () => {
    let todoListFilter = this.container.querySelector(
      `#${this.selectors.todoListDoneFilter}`
    ) as HTMLInputElement | null;
    // Remove previous event listeners
    todoListFilter?.replaceWith(todoListFilter.cloneNode(true));
    todoListFilter = this.container.querySelector(
      `#${this.selectors.todoListDoneFilter}`
    ) as HTMLInputElement | null;

    if (todoListFilter) {
      todoListFilter.checked = this.filters.done;
    }

    todoListFilter?.addEventListener("change", () => {
      this.filters.done = !this.filters.done;

      this.selectedDatabase.database?.setShouldFilterDoneTodos(
        this.filters.done
      );

      this.drawTodos();
    });
  };
}
