export function formatNumberFr(n: number, maximumFractionDigits = 2): string {
  if (isNaN(n)) {
    return "Valeur invalide";
  }

  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits }).format(n);
}
