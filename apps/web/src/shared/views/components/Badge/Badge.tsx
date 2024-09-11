import { ReactNode } from "react";
import DsfrBadge from "@codegouvfr/react-dsfr/Badge";
import classNames, { ClassValue } from "../../clsx";

type Props = {
  children: NonNullable<ReactNode>;
  className?: ClassValue;
  small?: boolean;
  style:
    | "default"
    | "green-emeraude"
    | "green-tilleul"
    | "blue"
    | "disabled"
    // we might need to create a separate component to avoid piling up styles
    | "success"
    | "error"
    | "neutral";
};

const badgeStyleClasses = {
  ["default"]: "tw-bg-white tw-text-[#161616]",
  ["green-emeraude"]: "tw-bg-[#E3FDEB] tw-text-[#297254]",
  ["green-tilleul"]: "tw-bg-[#FEF7DA] tw-text-[#66673D]",
  ["blue"]: "tw-bg-[#F4F6FE] tw-text-[#2F4077]",
  ["disabled"]: "tw-bg-[#E5E5E5] tw-text-[#929292]",
  ["success"]: "tw-bg-impacts-positive-light",
  ["error"]: "tw-bg-impacts-negative-light",
  ["neutral"]: "tw-bg-impacts-neutral-main dark:tw-bg-impacts-neutral-light",
} as const satisfies Record<Props["style"], string>;

export default function Badge({ children, className, small = false, style = "default" }: Props) {
  return (
    <DsfrBadge
      as="span"
      small={small}
      className={classNames(
        "tw-normal-case tw-font-normal tw-rounded-xl tw-px-2",
        badgeStyleClasses[style],
        className,
      )}
    >
      {children}
    </DsfrBadge>
  );
}
