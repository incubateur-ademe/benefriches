import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

import ModalBreadcrumb, { BreadcrumbProps } from "./ModalBreadcrumb";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbSegments: BreadcrumbProps["segments"];
  value?: {
    state: "success" | "error";
    text: string;
    description?: string;
  };
};

const ModalHeader = ({ title, subtitle, breadcrumbSegments, value }: Props) => {
  return (
    <div
      className={classNames(
        "tw-border-0",
        "tw-border-solid",
        "tw-border-b",
        "tw-border-borderGrey",
        "tw-bg-white dark:tw-bg-black",
        "tw-px-6",
        "tw-pb-6",
        "tw-mt-[-3rem]",
      )}
    >
      <div className="tw-max-w-[calc(100%-100px)] tw-pt-4">
        <ModalBreadcrumb segments={breadcrumbSegments} />
      </div>
      <h1 className="tw-text-2xl tw-m-0 tw-mb-2">{title}</h1>

      {subtitle && <span className="tw-font-bold">{subtitle}</span>}
      {value && (
        <div>
          <span
            className={classNames(
              "tw-text-2xl",
              "tw-font-bold",
              value.state === "success"
                ? "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light"
                : "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light",
            )}
          >
            {value.text}
          </span>

          {value.description && (
            <span className="tw-text-text-light">{` ${value.description}`}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
