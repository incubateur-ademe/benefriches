import { BreadcrumbProps } from "@/features/projects/views/shared/impacts/modals/ModalBreadcrumb";

import { mainBreadcrumbSection, localPeopleBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  localPeopleBreadcrumbSection,
  {
    label: "Personnes préservées des accidents de la route",
    contentState: {
      sectionName: mainBreadcrumbSection.contentState.sectionName,
      impactName: "avoided_traffic_accidents",
    },
  },
] as const;
