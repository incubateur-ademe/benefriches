import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import { breadcrumbSection } from "../breadcrumbSection";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  breadcrumbSection,
  {
    label: "Emplois équivalent temps plein",
    openState: {
      sectionName: breadcrumbSection.openState.sectionName,
      impactName: "full_time_jobs",
    },
  },
] as const;
