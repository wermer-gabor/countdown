import { EventEmitter, Listener } from "../../event-emitter";
import { databaseOptions } from "../databases/database-options";
import { DatabaseType } from "../types/database.type";

const SELECTED_DATABASE_LOCAL_STORAGE_KEY = "selected-database";

export class SelectedDatabase {
  private static EVENTS = {
    SELECTED_DATABASE_CHANGED: "selected-database-changed-event",
  };
  private emitter = new EventEmitter();

  private selectedDatabase: {
    id: string | null;
    instance: DatabaseType | null;
  };

  constructor() {
    const databaseId = localStorage.getItem(
      SELECTED_DATABASE_LOCAL_STORAGE_KEY
    );

    const option = databaseOptions.find(({ id }) => id === databaseId);

    this.selectedDatabase = {
      id: databaseId,
      instance: option?.database ?? null,
    };
  }

  get id() {
    return this.selectedDatabase.id;
  }

  set id(databaseId: string | null) {
    this.setDatabase(databaseId);
  }

  get database() {
    return this.selectedDatabase.instance;
  }

  public onDatabaseChange = (listener: Listener) => {
    this.emitter.on(
      SelectedDatabase.EVENTS.SELECTED_DATABASE_CHANGED,
      listener
    );
  };

  private setDatabase = (databaseId: string | null) => {
    localStorage.setItem(SELECTED_DATABASE_LOCAL_STORAGE_KEY, `${databaseId}`);

    const option = databaseOptions.find(({ id }) => id === databaseId);

    this.selectedDatabase.instance?.destory();

    this.selectedDatabase = {
      id: databaseId,
      instance: option?.database ?? null,
    };

    this.emitter.emit(
      SelectedDatabase.EVENTS.SELECTED_DATABASE_CHANGED,
      this.selectedDatabase.instance
    );
  };
}
