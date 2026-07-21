import { BreadcrumbProps } from "@/features/projects/views/shared/impacts/modals/ModalBreadcrumb";

import { mainBreadcrumbSection, humanityBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  humanityBreadcrumbSection,
  {
    label: "Valeur monétaire des services écosystémiques",
    contentState: {
      sectionName: mainBreadcrumbSection.contentState.sectionName,
      subSectionName: "humanity",

      impactName: "ecosystemServices",
    },
  },
] as const;
