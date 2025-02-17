export function getDaysFromTaxFrequency(tax_frequency: `${number}d`): number {
  return Number(tax_frequency.replace('d', ''));
}
