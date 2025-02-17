export function generatePaymentId(length = 27) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let paymentId = '';

  for (let i = 0; i < length; i++) {
    paymentId += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return paymentId;
}
