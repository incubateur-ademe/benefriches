import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  title: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
};

const ImpactsChartsSection = ({ title, children, onClick }: Props) => {
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
      <h3 className="tw-text-2xl">{title}</h3>
      <div className="tw-flex tw-flex-col tw-grow tw-justify-center">{children}</div>
    </section>
  );
};

export default ImpactsChartsSection;
