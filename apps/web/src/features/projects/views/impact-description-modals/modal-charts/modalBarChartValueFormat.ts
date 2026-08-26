import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

export const extractEmoji = (label: string) => {
  const [emoji] = label.split(" ", 1);

  if (emoji && /\p{Emoji}/u.test(emoji)) {
    return emoji;
  }
  return undefined;
};

const VALUE_FORMAT_OPTIONS = {
  co2: {
    maximumFractionDigits: 1,
  },
  monetary: {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  },
  default: { maximumFractionDigits: 0 },
} as const;

export type ValueFormat = "co2" | "monetary" | "default";
export const formatModalBarChartValue = (
  value: number,
  type: ValueFormat,
  options?: Intl.NumberFormatOptions,
) => {
  const unit = type === "co2" ? "t" : "";
  return `${formatNumberFr(value, {
    signDisplay: "exceptZero",
    ...VALUE_FORMAT_OPTIONS[type],
    ...options,
  })} ${unit}`;
};
