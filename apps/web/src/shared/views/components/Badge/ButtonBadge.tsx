import { HtmlHTMLAttributes } from "react";

import classNames from "../../clsx";
import { badgeStyleClasses, commonBadgeClasses, smallBadgeClasses } from "./classes";

type Props = {
  small?: boolean;
  color?: keyof typeof badgeStyleClasses;
} & HtmlHTMLAttributes<HTMLButtonElement>;

export default function ButtonBadge({
  children,
  className,
  small = false,
  color,
  ...props
}: Props) {
  return (
    <button
      className={classNames(
        commonBadgeClasses,
        small && smallBadgeClasses,
        color && badgeStyleClasses[color],
        "border border-transparent hover:border-current focus:border-current",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
