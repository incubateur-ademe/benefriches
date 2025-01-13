import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import { breadcrumbSection } from "../breadcrumbSection";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  breadcrumbSection,
  {
    label: "Impacts économiques directs",
  },
  {
    label: "Dépenses friche évitées",
    openState: {
      sectionName: breadcrumbSection.openState.sectionName,
      impactName: "avoided_friche_costs",
    },
  },
] as const;
