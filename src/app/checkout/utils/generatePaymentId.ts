export function generatePaymentId(length = 12) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let paymentId = '';

  for (let i = 0; i < length; i++) {
    const randomLetter = letters.charAt(
      Math.floor(Math.random() * letters.length),
    );
    const randomNumbers = numbers.charAt(
      Math.floor(Math.random() * numbers.length),
    );
    const randomLetterOrNumber = Math.round(Math.random())
      ? randomLetter
      : randomNumbers;
    paymentId += randomLetterOrNumber;
  }

  return paymentId;
}
