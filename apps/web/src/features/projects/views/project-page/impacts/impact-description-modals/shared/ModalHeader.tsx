import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

import { ImpactDescriptionModalCategory } from "../ImpactDescriptionModalWizard";
import ModalBreadcrumb from "./ModalBreadcrumb";

type Props = {
  title: ReactNode;
  breadcrumbSegments: { label: string; id?: ImpactDescriptionModalCategory }[];
};

const ModalHeader = ({ title, breadcrumbSegments }: Props) => {
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
        <h1 className="tw-text-2xl tw-m-0">{title}</h1>
      </div>
    </div>
  );
};

export default ModalHeader;
