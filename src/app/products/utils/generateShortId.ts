export function generateShortId(length = 7) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let shortId = '';

  for (let i = 0; i < length; i++) {
    shortId += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return shortId;
}
