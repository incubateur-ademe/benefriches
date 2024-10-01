import { ReactNode } from "react";
import classNames from "../../clsx";

type DataLineProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};

export default function DataLine({ label, value, className = "" }: DataLineProps) {
  const classes = classNames(
    "sm:tw-flex",
    "tw-justify-between",
    "tw-items-center",
    "tw-px-0",
    "tw-border-0",
    "tw-border-b",
    "tw-border-solid",
    "tw-border-borderGrey",
    className,
  );
  return (
    <dl className={classes}>
      <dd className={classNames("tw-ml-0", "tw-px-0", "tw-py-2")}>{label}</dd>
      <dt
        className={classNames(
          "sm:tw-w-[270px]",
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
