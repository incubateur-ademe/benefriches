import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

export type ChartCardProps = {
  children?: ReactNode;
  dialogId: string;
};

const ImpactsChartCard = ({ children, dialogId }: ChartCardProps) => {
  return (
    <button
      className={classNames(
        "tw-p-6",
        "tw-m-0",
        "tw-mb-8",
        "tw-rounded-2xl",
        "tw-flex",
        "tw-flex-col",
        "tw-justify-between",
        "tw-bg-white hover:!tw-bg-white",
        "dark:tw-bg-black hover:!tw-bg-black",
        "tw-border",
        "tw-border-solid",
        "tw-border-transparent",
        "tw-cursor-pointer",
        "hover:tw-border-current",
        "tw-transition tw-ease-in-out tw-duration-500",
        "tw-text-left",
        "tw-w-full",
      )}
      aria-controls={dialogId}
      data-fr-opened="false"
    >
      {children}
    </button>
  );
};

export default ImpactsChartCard;
