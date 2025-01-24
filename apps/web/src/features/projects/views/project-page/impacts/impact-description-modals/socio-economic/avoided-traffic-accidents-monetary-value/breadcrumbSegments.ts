import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import { mainBreadcrumbSection, socialMonetaryBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  socialMonetaryBreadcrumbSection,
  {
    label: "Dépenses de santé évitées grâce à la diminution des accidents de la route",
    openState: {
      sectionName: mainBreadcrumbSection.openState.sectionName,
      impactName: "avoided_traffic_accidents",
    },
  },
] as const;
