export const getFormattedSecondsUtil = (seconds: number): string => {
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
