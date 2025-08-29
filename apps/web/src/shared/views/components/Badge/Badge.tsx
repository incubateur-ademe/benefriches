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
  ["default"]: "bg-white text-[#161616]",
  ["green-emeraude"]: "bg-[#E3FDEB] text-[#297254]",
  ["green-tilleul"]: "bg-[#FEF7DA] text-[#66673D]",
  ["blue"]: "bg-[#DEE5FD] text-[#2F4077]",
  ["success"]: "bg-impacts-positive-light",
  ["error"]: "bg-impacts-negative-light",
  ["neutral"]: "bg-impacts-neutral-main dark:bg-impacts-neutral-light",
} as const;

export default function Badge({ children, className, small = false, style, onClick }: Props) {
  return (
    <span
      role={onClick ? "button" : undefined}
      className={classNames(
        "fr-badge normal-case font-normal rounded-xl px-2",
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
