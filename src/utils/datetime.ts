export const getLocalTimeFromStringOrObject = (date: Date | string) => {
  if (typeof date === "object") {
    return date;
  }
  return new Date(date);
};

export const toLocalIsoStringForForm = (date: Date) => {
  const pad = function (num: number) {
    return (num < 10 ? "0" : "") + num;
  };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
};
