export function formatNumberFr(n: number, maximumFractionDigits: number = 2): string {
  if (isNaN(n)) {
    return "Valeur invalide";
  }

  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits }).format(n);
}
