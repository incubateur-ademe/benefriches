import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import {
  mainBreadcrumbSection,
  economicDirectMonetaryBreadcrumbSection,
} from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  economicDirectMonetaryBreadcrumbSection,
  {
    label: "Dépenses friche évitées",
    openState: {
      sectionName: mainBreadcrumbSection.openState.sectionName,
      impactName: "avoided_friche_costs",
    },
  },
] as const;
