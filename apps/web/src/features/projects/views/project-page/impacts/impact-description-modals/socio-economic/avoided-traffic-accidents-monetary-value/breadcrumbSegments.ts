import { BreadcrumbProps } from "@/features/projects/views/shared/impacts/modals/ModalBreadcrumb";

import { mainBreadcrumbSection, socialMonetaryBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  socialMonetaryBreadcrumbSection,
  {
    label: "Dépenses de santé évitées grâce à la diminution des accidents de la route",
    contentState: {
      sectionName: mainBreadcrumbSection.contentState.sectionName,
      impactName: "avoided_traffic_accidents",
    },
  },
] as const;
