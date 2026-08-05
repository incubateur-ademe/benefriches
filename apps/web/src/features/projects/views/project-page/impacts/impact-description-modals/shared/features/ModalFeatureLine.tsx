import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type DataLineProps = {
  label: ReactNode;
  isTotal?: boolean;
  value: ReactNode;
};
function ModalFeatureLine({ label, value, isTotal }: DataLineProps) {
  return (
    <dl className="grid grid-cols-[9fr_3fr] [&:first-child>*]:py-3 [&:last-child>*]:pb-3 [&:first-child>*]:content-center">
      <dd className={classNames("p-0", isTotal && "uppercase text-sm font-bold")}>{label}</dd>
      <dt className={classNames("px-2 sm:text-right bg-grey-light dark:bg-grey-dark rounded-r-sm")}>
        <span className={isTotal ? "font-bold" : undefined}>{value}</span>
      </dt>
    </dl>
  );
}

export default ModalFeatureLine;
