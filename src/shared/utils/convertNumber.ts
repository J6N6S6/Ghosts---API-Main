export function convertNumber(value: string | number) {
  const convertNumber = Number(value).toFixed(2);
  return Number(convertNumber);
}
