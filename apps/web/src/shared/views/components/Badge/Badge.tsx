import { ReactNode } from "react";

import classNames, { ClassValue } from "../../clsx";

type Props = {
  children: NonNullable<ReactNode>;
  className?: ClassValue;
  small?: boolean;
  onClick?: () => void;
  style?: keyof typeof badgeStyleClasses;
};

const badgeStyleClasses = {
  ["default"]: "tw-bg-white tw-text-[#161616]",
  ["green-emeraude"]: "tw-bg-[#E3FDEB] tw-text-[#297254]",
  ["green-tilleul"]: "tw-bg-[#FEF7DA] tw-text-[#66673D]",
  ["blue"]: "tw-bg-[#DEE5FD] tw-text-[#2F4077]",
  ["success"]: "tw-bg-impacts-positive-light",
  ["error"]: "tw-bg-impacts-negative-light",
  ["neutral"]: "tw-bg-impacts-neutral-main dark:tw-bg-impacts-neutral-light",
} as const;

export default function Badge({ children, className, small = false, style, onClick }: Props) {
  return (
    <span
      role={onClick ? "button" : undefined}
      className={classNames(
        "fr-badge tw-normal-case tw-font-normal tw-rounded-xl tw-px-2",
        small && "fr-badge--sm",
        style && badgeStyleClasses[style],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
