import { formatNumberFr } from "shared";

export {
  formatNumberFr,
  formatPercentage,
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "shared";

export function formatMoney(amount: number): string {
  return `${formatNumberFr(amount)} €`;
}
