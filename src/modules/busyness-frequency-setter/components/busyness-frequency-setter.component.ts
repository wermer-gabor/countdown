import { SelectedDatabase } from "../../database";
import { getFormattedSecondsUtil } from "../utils/get-fromatted-seconds.util";

export class BusynessFrequencySetterComponent {
  private onCountdownFinished: () => void;
  private selectedDatabase: SelectedDatabase;

  private isLazy: boolean = true;

  private timeout: NodeJS.Timeout | undefined;

  private container: HTMLElement;
  private selectors = {
    busynessFrequencyInput: "busyness-frequency-input",
    nextBusyTime: "next-busy-time",
    keepBusyTime: "keep-busy-time",
    busyTextContainer: "busy-text-container",
    lazyTextContainer: "lazy-text-container",
  };

  constructor({
    containerId,
    onCountdownFinished,
    selectedDatabase,
  }: {
    containerId: string;
    onCountdownFinished: () => void;
    selectedDatabase: SelectedDatabase;
  }) {
    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error(`Couldn't find container by id: ${containerId}`);
    }

    this.container = container;
    this.onCountdownFinished = onCountdownFinished;
    this.selectedDatabase = selectedDatabase;

    if (this.selectedDatabase.database) {
      this.handleDatabaseChange();
    }

    this.selectedDatabase.onDatabaseChange(this.handleDatabaseChange);
  }

  private handleDatabaseChange = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (this.selectedDatabase.database) {
      this.selectedDatabase.database
        .getBusynessFrequency()
        .then((busynessFrquency: number) => {
          this.handleBusynessFrequencyChange(busynessFrquency);
          this.drawBusynessFrequencyValue(busynessFrquency);
        });

      this.selectedDatabase.database.onClear(() => {
        this.handleBusynessFrequencyChange(0);
        this.drawBusynessFrequencyValue(0);
      });
    }
  };

  public setUpListeners = () => {
    this.setUpBusynessFrequencyInput();
  };

  private setUpBusynessFrequencyInput = () => {
    const busynessFrequencyInput = this.container.querySelector(
      `#${this.selectors.busynessFrequencyInput}`
    );

    busynessFrequencyInput?.addEventListener("change", (event) => {
      if (event.target instanceof HTMLInputElement) {
        const seconds = +event.target.value;

        this.handleBusynessFrequencyChange(seconds);

        if (!Number.isNaN(seconds)) {
          this.selectedDatabase.database?.setBusynessFrequency(seconds);
        }
      }
    });
  };

  private handleBusynessFrequencyChange = (seconds: number) => {
    if (seconds === 0) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.isLazy = true;
    } else if (!Number.isNaN(seconds)) {
      this.isLazy = false;
      this.startCountdown(seconds);
    }

    this.swtichBetweenLazyAndBusyText();
  };

  private startCountdown = (seconds: number) => {
    this.countdown(seconds, () => {
      this.onCountdownFinished();
      this.startCountdown(seconds);
    });

    this.drawKeepBusyTime(seconds);
  };

  private countdown = (
    seconds: number,
    onCountdownFinished: () => void
  ): void => {
    this.drawNextBusyTime(seconds);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (seconds === 0) {
      onCountdownFinished();
      return;
    }

    this.timeout = setTimeout(() => {
      this.countdown(seconds - 1, onCountdownFinished);
    }, 1000);
  };

  private drawNextBusyTime = (seconds: number): void => {
    const formattedTime = getFormattedSecondsUtil(seconds);

    const nextBusyTimeSpan = this.container.querySelector(
      `#${this.selectors.nextBusyTime}`
    );

    if (nextBusyTimeSpan) {
      nextBusyTimeSpan.textContent = formattedTime;
    }
  };

  private drawKeepBusyTime = (seconds: number): void => {
    const keepBusyUntilDate = new Date(Date.now() + seconds * 1000);

    const time =
      keepBusyUntilDate.getHours() * 60 * 60 +
      keepBusyUntilDate.getMinutes() * 60 +
      keepBusyUntilDate.getSeconds();

    const formattedTime = getFormattedSecondsUtil(time);

    const keepBusyTimeSpan = this.container.querySelector(
      `#${this.selectors.keepBusyTime}`
    );

    if (keepBusyTimeSpan) {
      keepBusyTimeSpan.textContent = formattedTime;
    }
  };

  private drawBusynessFrequencyValue = (busynessFrequency: number) => {
    const input = this.container.querySelector(
      `#${this.selectors.busynessFrequencyInput}`
    ) as HTMLInputElement | null;

    if (input) {
      input.value = busynessFrequency.toString();
    }
  };

  private swtichBetweenLazyAndBusyText = () => {
    const lazyTextContainer = this.container.querySelector(
      `#${this.selectors.lazyTextContainer}`
    ) as HTMLElement | null;
    const busyTextContainer = this.container.querySelector(
      `#${this.selectors.busyTextContainer}`
    ) as HTMLElement | null;

    if (lazyTextContainer && busyTextContainer) {
      if (this.isLazy) {
        lazyTextContainer.style.display = "block";
        busyTextContainer.style.display = "none";
      } else {
        lazyTextContainer.style.display = "none";
        busyTextContainer.style.display = "block";
      }
    }
  };
}
