import { ReactNode } from "react";
import classNames from "../../clsx";

type DataLineProps = {
  label: ReactNode;
  value: ReactNode;
  isDetails?: boolean;
  noBorder?: boolean;
  className?: string;
};

export default function DataLine({
  label,
  value,
  className = "",
  isDetails = false,
  noBorder = false,
}: DataLineProps) {
  const bordersClasses = isDetails
    ? ["tw-border-l-black", "tw-border-l"]
    : ["tw-border-b", "tw-border-borderGrey"];
  const classes = classNames(
    "tw-grid",
    "tw-grid-cols-[8fr_4fr]",
    "tw-px-0",
    "tw-border-0",
    "tw-border-solid",
    !noBorder && bordersClasses,
    className,
  );
  return (
    <dl className={classes}>
      <dd className={classNames("tw-ml-0", "tw-px-0", "tw-py-2", isDetails && "tw-pl-4")}>
        {label}
      </dd>
      <dt
        className={classNames(
          "sm:tw-text-right",
          "tw-p-2",
          "tw-bg-grey-light",
          "dark:tw-bg-grey-dark",
        )}
      >
        {value}
      </dt>
    </dl>
  );
}
