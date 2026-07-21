import { BreadcrumbProps } from "@/features/projects/views/shared/impacts/modals/ModalBreadcrumb";

import { mainBreadcrumbSection, humanityBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  humanityBreadcrumbSection,
  {
    label: "Dépenses de santé évitées grâce à la diminution des accidents de la route",
    contentState: {
      sectionName: mainBreadcrumbSection.contentState.sectionName,
      subSectionName: "humanity",

      impactName: "avoidedTrafficAccidents",
    },
  },
] as const;
