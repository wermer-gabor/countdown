import { Database } from "./database.type";
import { LocalStorageDatabase } from "./local-storage.database";
import { SessionStorageDatabase } from "./session-storage.database";

type DatabaseOption = {
  id: string;
  label: string;
  database: Database;
};

const getTemplate = ({ id, label }: DatabaseOption, isSelected: boolean) => `
  <div class="form-check me-4" data-database-id=${id}>
    <input class="form-check-input" type="checkbox" role="button" id="${id}" ${
  isSelected ? "checked" : ""
}>
    <label class="form-check-label user-select-none" role="button" for="${id}">${label}</label>
  </div>
`;

const selectedDatabaseIdLocalStorageKey = "selected-database";
const databaseOptions: DatabaseOption[] = [
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
let selectedDatabaseId = localStorage.getItem(
  selectedDatabaseIdLocalStorageKey
);

const drawOptions = (container: Element) => {
  let databaseSelectorsHtml = "";

  databaseOptions.forEach((option) => {
    const template = getTemplate(option, option.id === selectedDatabaseId);

    databaseSelectorsHtml += template;
  });

  container.innerHTML = databaseSelectorsHtml;
};

export const setUpDatabaseSelectors = (
  setSelectedDatabase: (database: Database | null) => void
) => {
  const id = "database-selectors";

  const databseSelectors = document.querySelector(`#${id}`);

  if (databseSelectors) {
    setSelectedDatabase(
      databaseOptions.find(({ id }) => id === selectedDatabaseId)?.database ??
        null
    );
    localStorage.setItem(
      selectedDatabaseIdLocalStorageKey,
      selectedDatabaseId ?? ""
    );
    drawOptions(databseSelectors);

    databseSelectors.addEventListener("change", async (event) => {
      if (event.target instanceof HTMLElement) {
        const container = event.target.closest("div.form-check");

        if (container instanceof HTMLElement) {
          const id = container.dataset.databaseId;
          const selectedOption = databaseOptions.find(
            (option) => option.id === id
          );

          if (selectedOption) {
            const isItAlreadySelected =
              selectedOption.id === selectedDatabaseId;
            selectedDatabaseId = isItAlreadySelected ? null : selectedOption.id;
            const selectedDatabase =
              databaseOptions.find(({ id }) => id === selectedDatabaseId)
                ?.database ?? null;

            localStorage.setItem(
              selectedDatabaseIdLocalStorageKey,
              selectedDatabaseId ?? ""
            );

            setSelectedDatabase(selectedDatabase);

            drawOptions(databseSelectors);
          }
        }
      }
    });
  }
};

export const setUpClearDatabaseListener = (onFinish: () => void) => {
  const id = 'clear-databse';
  const clearButton = document.getElementById(id);

  clearButton?.addEventListener('click', () => {
    const selectedDatabase = databaseOptions.find(({ id }) => id === selectedDatabaseId)?.database;

    if (selectedDatabase) {
      selectedDatabase.clear();
      onFinish();
    }
  });
}