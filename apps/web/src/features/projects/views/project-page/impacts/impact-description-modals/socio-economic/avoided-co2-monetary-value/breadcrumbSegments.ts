import { BreadcrumbProps } from "@/features/projects/views/shared/impacts/modals/ModalBreadcrumb";

import { mainBreadcrumbSection, humanityBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  humanityBreadcrumbSection,
  {
    label: "Valeur monétaire de la décarbonation ",
    contentState: {
      sectionName: mainBreadcrumbSection.contentState.sectionName,
      subSectionName: "humanity",
      impactName: "avoidedCo2eqEmissions",
    },
  },
] as const;
