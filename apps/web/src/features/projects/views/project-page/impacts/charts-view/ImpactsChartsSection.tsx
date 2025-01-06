import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
};

const ImpactsChartsSection = ({ title, subtitle, children, onClick }: Props) => {
  return (
    <section
      className={classNames(
        "tw-p-6",
        "tw-m-0",
        "tw-mb-8",
        "tw-rounded-2xl",
        "tw-flex",
        "tw-flex-col",
        "tw-h-full",
        "tw-bg-white",
        "dark:tw-bg-black",
        "tw-border",
        "tw-border-solid",
        "tw-border-transparent",
        onClick && [
          "tw-cursor-pointer",
          "hover:tw-border-current",
          "tw-transition tw-ease-in-out tw-duration-500",
        ],
      )}
      onClick={onClick}
    >
      <h3
        className={classNames("tw-text-2xl", !subtitle ? "tw-mb-[calc(4rem + 20px)]" : "tw-mb-2")}
      >
        {title}
      </h3>
      {subtitle && <h4 className="tw-text-sm tw-font-normal tw-mb-2">{subtitle}</h4>}
      <div className="tw-flex tw-flex-col tw-grow tw-justify-between">{children}</div>
    </section>
  );
};

export default ImpactsChartsSection;
