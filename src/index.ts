import { Database, setUpClearDatabaseListener, setUpDatabaseSelectors } from './databases';
import { setUpBusynessFrequencyInput } from './timer';
import { TodoList } from './todos';


let selectedDatabase: Database | null;
const todoList = new TodoList();

const setSelectedDatabase = (database: Database | null) => {
  selectedDatabase = database;
  todoList.setDatabase(selectedDatabase);
}

setUpClearDatabaseListener(() => {
  todoList.setDatabase(selectedDatabase)
})

setUpDatabaseSelectors(setSelectedDatabase);

setUpBusynessFrequencyInput(todoList.addTodo);
