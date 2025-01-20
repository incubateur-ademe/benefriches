import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import { mainBreadcrumbSection, jobsBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  jobsBreadcrumbSection,
  {
    label: "Emplois équivalent temps plein",
    openState: {
      sectionName: mainBreadcrumbSection.openState.sectionName,
      impactName: "full_time_jobs",
    },
  },
] as const;
