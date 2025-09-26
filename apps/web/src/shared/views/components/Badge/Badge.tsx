import { ReactNode } from "react";

import classNames, { ClassValue } from "../../clsx";
import { badgeStyleClasses, commonBadgeClasses, smallBadgeClasses } from "./classes";

type Props = {
  children: NonNullable<ReactNode>;
  className?: ClassValue;
  small?: boolean;
  onClick?: () => void;
  style?: keyof typeof badgeStyleClasses;
};

export default function Badge({ children, className, small = false, style }: Props) {
  return (
    <span
      className={classNames(
        commonBadgeClasses,
        small && smallBadgeClasses,
        style && badgeStyleClasses[style],
        className,
      )}
    >
      {children}
    </span>
  );
}
