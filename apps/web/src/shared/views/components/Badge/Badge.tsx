import { ReactNode } from "react";
import DsfrBadge from "@codegouvfr/react-dsfr/Badge";
import classNames, { ClassValue } from "../../clsx";

type Props = {
  children: NonNullable<ReactNode>;
  className?: ClassValue;
  small?: boolean;
};

export default function Badge({ children, className, small = false }: Props) {
  return (
    <DsfrBadge
      as="span"
      small={small}
      className={classNames("tw-normal-case tw-font-normal tw-rounded-xl tw-px-2", className)}
    >
      {children}
    </DsfrBadge>
  );
}
