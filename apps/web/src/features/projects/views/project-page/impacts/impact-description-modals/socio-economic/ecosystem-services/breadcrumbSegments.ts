import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import {
  mainBreadcrumbSection,
  environmentalMonetaryBreadcrumbSection,
} from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  environmentalMonetaryBreadcrumbSection,
  {
    label: "Services écosystémiques",
    openState: {
      sectionName: mainBreadcrumbSection.openState.sectionName,
      impactName: "ecosystem_services",
    },
  },
] as const;
