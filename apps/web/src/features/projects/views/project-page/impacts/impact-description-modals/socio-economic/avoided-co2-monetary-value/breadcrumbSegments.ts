import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import {
  mainBreadcrumbSection,
  environmentalMonetaryBreadcrumbSection,
} from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  environmentalMonetaryBreadcrumbSection,
  {
    label: "Valeur monétaire de la décarbonation ",
    openState: {
      sectionName: mainBreadcrumbSection.openState.sectionName,
      impactName: "avoided_co2_eq_emissions",
    },
  },
] as const;
