import { BusynessFrequencySetter } from "./modules/busyness-frequency-setter";
import {
  DatabaseSelectorComponent,
  SelectedDatabase,
} from "./modules/database";
import { TodoListComponent } from "./modules/todo-list";

const selectedDatabase = new SelectedDatabase();

const databaseSelector = new DatabaseSelectorComponent({
  containerId: "database-selector-container",
  selectedDatabase,
});
databaseSelector.setUpListeners();

const todoList = new TodoListComponent({
  containerId: "todo-list-container",
  selectedDatabase,
});
todoList.initialize();

const busynessFrequencySetter = new BusynessFrequencySetter({
  containerId: "busyness-frequency-setter",
  onCountdownFinished: todoList.addTodo,
  selectedDatabase,
});
busynessFrequencySetter.setUpListeners();
