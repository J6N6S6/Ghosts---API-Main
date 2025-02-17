export function calculateReadingTime(text: string) {
  // Remover espaços em branco extras e quebras de linha
  const cleanText = text.trim().replace(/\s+/g, ' ');

  // Dividir o texto em palavras usando espaços como delimitadores
  const words = cleanText.split(' ');

  // Número de palavras no texto
  const wordCount = words.length;

  // Média de palavras por minuto em português
  const wordsPerMinute = 200;

  // Calcular o tempo de leitura em minutos
  const readingTimeMinutes = wordCount / wordsPerMinute;

  // Arredondar para o próximo número inteiro
  const roundedReadingTimeMinutes = Math.ceil(readingTimeMinutes);

  return roundedReadingTimeMinutes;
}
