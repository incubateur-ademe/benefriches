import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import { mainBreadcrumbSection, co2BreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  co2BreadcrumbSection,
  {
    label: "CO2-eq stocké ou évité",
    openState: {
      sectionName: mainBreadcrumbSection.openState.sectionName,
      impactName: "co2_benefit",
    },
  },
] as const;
