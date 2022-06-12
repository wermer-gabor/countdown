import { databaseOptions } from "../databases/database-options";
import { DatabaseType } from "../types/database.type";
import { SelectedDatabase } from "../utils/selected-database.util";

type DatabaseOption = {
  id: string;
  label: string;
  database: DatabaseType;
};

export class DatabaseSelectorComponent {
  private selectedDatabase: SelectedDatabase;

  private container: HTMLElement;
  private selectors = {
    optionsContainer: "database-options-container",
    clearButton: "clear-database",
  };

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

    this.drawOptions();
  }

  public setUpListeners = () => {
    this.setUpClearDatabaseListener();
    this.setUpDatabaseSelectors();
  };

  // Drawing
  private drawOptions = () => {
    let databaseSelectorsHtml = "";

    databaseOptions.forEach((option) => {
      const template = this.getHTMLForOption(
        option,
        option.id === this.selectedDatabase.id
      );

      databaseSelectorsHtml += template;
    });

    const optionsContainer = this.container.querySelector(
      `#${this.selectors.optionsContainer}`
    );

    if (optionsContainer) {
      optionsContainer.innerHTML = databaseSelectorsHtml;
    }
  };

  private getHTMLForOption = (
    { id, label }: DatabaseOption,
    isSelected: boolean
  ) => `
    <div class="form-check me-4" data-database-id=${id}>
      <input class="form-check-input" type="checkbox" role="button" id="${id}" ${
    isSelected ? "checked" : ""
  }>
      <label class="form-check-label user-select-none" role="button" for="${id}">${label}</label>
    </div>
  `;

  // Listeners
  private setUpDatabaseSelectors = () => {
    const optionsContainer = this.container.querySelector(
      `#${this.selectors.optionsContainer}`
    );

    optionsContainer?.addEventListener("change", async (event) => {
      if (event.target instanceof HTMLElement) {
        const checkboxContainer = event.target.closest("div.form-check");

        if (checkboxContainer instanceof HTMLElement) {
          const { databaseId } = checkboxContainer.dataset;
          const selectedOption = databaseOptions.find(
            (option) => option.id === databaseId
          );

          if (selectedOption) {
            const isItAlreadySelected =
              selectedOption.id === this.selectedDatabase.id;

            this.selectedDatabase.id = isItAlreadySelected
              ? null
              : selectedOption.id;

            this.drawOptions();
          }
        }
      }
    });
  };

  private setUpClearDatabaseListener = () => {
    const clearButton = this.container.querySelector(
      `#${this.selectors.clearButton}`
    );

    clearButton?.addEventListener("click", () => {
      const selectedDatabase = this.selectedDatabase.database;

      if (selectedDatabase) {
        selectedDatabase.clear();
      }
    });
  };
}
