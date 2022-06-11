const getFormattedSeconds = (seconds: number): string => {
  const toDoubleDigits = (number: number): string =>
    number > 9 ? number.toString() : `0${number}`;

  let time = seconds;
  let formattedTime = "";

  const hours = Math.floor(time / 60 / 60);

  if (hours > 0) {
    formattedTime += `${toDoubleDigits(hours)}:`;
    time -= hours * 60 * 60;
  } else {
    formattedTime += "00:";
  }

  const minutes = Math.floor(time / 60);

  if (minutes > 0) {
    formattedTime += `${toDoubleDigits(minutes)}:`;
    time -= minutes * 60;
  } else {
    formattedTime += "00:";
  }

  formattedTime += toDoubleDigits(time);

  return formattedTime;
};

const setClock = (seconds: number): void => {
  const id = "next-busy-clock";

  const formattedTime = getFormattedSeconds(seconds);

  const clock = document.querySelector(`#${id}`)!;

  clock.textContent = formattedTime;
};

const setUntil = (seconds: number) => {
  const id = "keep-busy-until";

  const beBackDate = new Date(Date.now() + seconds * 1000);

  const time =
    beBackDate.getHours() * 60 * 60 +
    beBackDate.getMinutes() * 60 +
    beBackDate.getSeconds();

  const text = getFormattedSeconds(time);

  const beBack = document.querySelector(`#${id}`)!;

  beBack.textContent = text;
};

let timeout: NodeJS.Timeout;
let time: number;
const setTimer = (seconds: number, onFinish: () => void): void => {
  setClock(seconds);

  time = seconds;

  if (timeout) {
    clearTimeout(timeout);
  }

  if (seconds === 0) {
    onFinish();
    return;
  }

  timeout = setTimeout(() => {
    setTimer(seconds - 1, onFinish);
  }, 1000);
};

export const countDown = (seconds: number, onFinish: () => void) => {
  setTimer(seconds, () => {
    onFinish();
    countDown(seconds, onFinish);
  });
  setUntil(seconds);
};

export const setUpBusynessFrequencyInput = (onFinish: () => void) => {
  const customInputField = document.querySelector("#busyness-frequency");
  customInputField?.addEventListener("change", (event) => {
    if (event.target instanceof HTMLInputElement) {
      const seconds = +event.target.value;

      if (!Number.isNaN(seconds)) {
        countDown(seconds, onFinish);
      }
    }
  });
}