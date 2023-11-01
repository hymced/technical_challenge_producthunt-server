export const getformatedTime = (date: Date) => {
  return `${padDigits(date.getHours())}:${padDigits(date.getMinutes())}`
};

const padDigits = (num: number, digits = 2) => {
  return Array(Math.max(digits - String(num).length + 1, 0)).join('0') + num;
};