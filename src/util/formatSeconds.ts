export default function formatSeconds(value: number) {
  let secondTime: number | string = value;
  let minuteTime: number | string = 0;
  let hourTime: number | string = 0;
  if (secondTime > 60) {
    minuteTime = (secondTime / 60).toFixed(1).slice(0, -2);
    secondTime = (secondTime % 60).toFixed(1).slice(0, -2);
    if (Number(minuteTime) > 60) {
      hourTime = (Number(minuteTime) / 60).toFixed(1).slice(0, -2);
      minuteTime = (Number(minuteTime) % 60).toFixed(1).slice(0, -2);
    }
  }
  if (Number(secondTime) === 0) {
    secondTime = "00";
  } else if (Number(secondTime) < 10) {
    secondTime = `0${secondTime}`;
  }
  if (Number(minuteTime) === 0) {
    minuteTime = "00";
  } else if (Number(minuteTime) < 10) {
    minuteTime = `0${minuteTime}`;
  }
  if (Number(hourTime) === 0) {
    hourTime = "00";
  } else if (Number(hourTime) < 10) {
    hourTime = `0${hourTime}`;
  }
  const result = `${hourTime}:${minuteTime}:${secondTime}`;
  return result;
}
