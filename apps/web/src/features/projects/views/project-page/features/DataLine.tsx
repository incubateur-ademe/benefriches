import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type DataLineProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};
export default function DataLine({ label, value, className = "" }: DataLineProps) {
  const classes = classNames(
    "tw-flex",
    "tw-justify-between",
    "tw-py-2",
    "tw-px-0",
    "tw-border-0",
    "tw-border-b",
    "tw-border-solid",
    "tw-border-borderGrey",
    className,
  );
  return (
    <dl className={classes}>
      <dd className="fr-p-0">{label}</dd>
      <dt className="tw-text-right">{value}</dt>
    </dl>
  );
}
