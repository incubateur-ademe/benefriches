import { ReactNode } from "react";

import { ImpactDescriptionModalCategory } from "../ImpactDescriptionModalWizard";
import ModalBreadcrumb from "./ModalBreadcrumb";

type Props = {
  title: ReactNode;
  breadcrumbSegments: { label: string; id?: ImpactDescriptionModalCategory }[];
};

const ModalHeader = ({ title, breadcrumbSegments }: Props) => {
  return (
    <div className="tw-max-w-[calc(100%-100px)] tw-mt-[-2rem]">
      <ModalBreadcrumb segments={breadcrumbSegments} />
      <h1 className="tw-text-2xl tw-mt-2">{title}</h1>
    </div>
  );
};

export default ModalHeader;
