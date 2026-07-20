/**
 * Mirrors the app's number formatting (fr-FR locale) so e2e assertions can match
 * rendered text exactly instead of approximating it with a loose regex (e.g. the
 * narrow no-break space fr-FR uses as a thousands separator).
 */
export function asEuroAmount(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(amount)} €`;
}

export function asSquareMeters(surfaceArea: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(surfaceArea)} ㎡`;
}
