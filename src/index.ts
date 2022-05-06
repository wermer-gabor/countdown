const toDoubleDigits = (number: number): string =>
  number > 9 ? number.toString() : `0${number}`;

const getFormattedSeconds = (seconds: number): string => {
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
  const id = "clock";
  const formattedTime = getFormattedSeconds(seconds);

  const clock = document.querySelector(`#${id}`)!;

  clock.textContent = formattedTime;
};

let timeout: NodeJS.Timeout;
let time: number;
const setTimer = (seconds: number): void => {
  setClock(seconds);

  time = seconds;

  if (timeout) {
    clearTimeout(timeout);
  }

  if (seconds === 0) {
    return;
  }

  timeout = setTimeout(() => {
    setTimer(seconds - 1);
  }, 1000);
};

const setBeBack = (seconds: number) => {
  const id = "be-back";

  const beBackDate = new Date(Date.now() + seconds * 1000);

  const time =
    beBackDate.getHours() * 60 * 60 +
    beBackDate.getMinutes() * 60 +
    beBackDate.getSeconds();

  const text = `Be back at ${getFormattedSeconds(time)}`;

  const beBack = document.querySelector(`#${id}`)!;

  beBack.textContent = text;
};

const buttons = [
  { id: "twenty-secs", seconds: 20 },
  { id: "work-five", seconds: 5 * 60 },
  { id: "quick-fifteen", seconds: 15 * 60 },
  { id: "snack-twenty", seconds: 20 * 60 },
  { id: "lunch-break", seconds: 60 * 60 },
];

buttons.forEach(({ id, seconds }) => {
  document.querySelector(`#${id}`)!.addEventListener("click", () => {
    setTimer(seconds);
    setBeBack(seconds);
  });
});

const customInputField = document.querySelector("#custom")!;

customInputField.addEventListener("change", (event) => {
  if (event.target instanceof HTMLInputElement) {
    const minutes = event.target.value;

    if (!Number.isNaN(minutes)) {
      const seconds = +minutes * 60;
      setTimer(seconds);
      setBeBack(seconds);
    }
  }
});
