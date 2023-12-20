import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

export const SQUARE_METERS_HTML_SYMBOL = "㎡";

type Props = {
  surfaceAreaInSquareMeters: number;
};

export default function SurfaceArea({ surfaceAreaInSquareMeters }: Props) {
  return (
    <span>
      {formatNumberFr(surfaceAreaInSquareMeters)}&nbsp;
      {SQUARE_METERS_HTML_SYMBOL}
    </span>
  );
}
