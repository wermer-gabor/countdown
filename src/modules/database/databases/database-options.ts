import { DatabaseOption } from "../types/database-option.type";
import { LocalStorageDatabase } from "./local-storage.database";
import { SessionStorageDatabase } from "./session-storage.database";

export const databaseOptions: DatabaseOption[] = [
  {
    id: "local-storage",
    label: "Local storage",
    database: new LocalStorageDatabase(),
  },
  {
    id: "session-storage",
    label: "Session storage",
    database: new SessionStorageDatabase(),
  },
];
