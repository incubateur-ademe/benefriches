import { ClassValue } from "../../clsx";

export const commonBadgeClasses: ClassValue[] = [
  "fr-badge",
  "normal-case",
  "font-normal",
  "rounded-xl",
  "px-2",
];
export const smallBadgeClasses: ClassValue[] = ["fr-badge--sm"];

export const badgeStyleClasses = {
  ["default"]: "bg-white text-[#161616]",
  ["green-emeraude"]: "bg-[#E3FDEB] text-[#297254]",
  ["green-tilleul"]: "bg-[#FEF7DA] text-[#66673D]",
  ["blue"]: "bg-[#DEE5FD] text-[#2F4077]",
  ["success"]: "bg-impacts-positive-light",
  ["error"]: "bg-impacts-negative-light",
  ["neutral"]: "bg-impacts-neutral-main dark:bg-impacts-neutral-light",
} as const;
