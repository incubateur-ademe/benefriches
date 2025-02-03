import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import { mainBreadcrumbSection, economicDirectBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  economicDirectBreadcrumbSection,
  {
    label: "Dépenses friche évitées",
    openState: {
      sectionName: mainBreadcrumbSection.openState.sectionName,
      impactName: "avoided_friche_costs",
    },
  },
] as const;
