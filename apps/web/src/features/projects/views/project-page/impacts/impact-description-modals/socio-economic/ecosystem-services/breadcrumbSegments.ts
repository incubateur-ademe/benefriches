import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import { breadcrumbSection } from "../breadcrumbSection";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  breadcrumbSection,
  {
    label: "Impacts environnementaux monétarisés",
  },
  {
    label: "Services écosystémiques",
    openState: {
      sectionName: breadcrumbSection.openState.sectionName,
      impactName: "ecosystem_services",
    },
  },
] as const;
