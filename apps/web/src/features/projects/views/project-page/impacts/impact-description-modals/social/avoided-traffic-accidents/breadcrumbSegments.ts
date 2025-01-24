import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import { mainBreadcrumbSection, localPeopleBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  localPeopleBreadcrumbSection,
  {
    label: "Personnes préservées des accidents de la route",
    openState: {
      sectionName: mainBreadcrumbSection.openState.sectionName,
      impactName: "avoided_traffic_accidents",
    },
  },
] as const;
