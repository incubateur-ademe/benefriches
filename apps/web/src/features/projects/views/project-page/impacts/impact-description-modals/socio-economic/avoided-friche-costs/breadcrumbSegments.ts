import { BreadcrumbProps } from "@/features/projects/views/shared/impacts/modals/ModalBreadcrumb";

import { mainBreadcrumbSection, economicDirectBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  economicDirectBreadcrumbSection,
  {
    label: "Dépenses friche évitées",
    contentState: {
      sectionName: mainBreadcrumbSection.contentState.sectionName,
      impactName: "avoided_friche_costs",
    },
  },
] as const;
