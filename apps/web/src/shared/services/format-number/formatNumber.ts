export function formatNumberFr(n: number): string {
  if (isNaN(n)) {
    return "Valeur invalide";
  }

  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(n);
}
