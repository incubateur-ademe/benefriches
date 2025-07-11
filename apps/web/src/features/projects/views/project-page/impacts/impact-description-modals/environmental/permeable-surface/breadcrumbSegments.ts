import { BreadcrumbProps } from "@/features/projects/views/shared/impacts/modals/ModalBreadcrumb";

import { mainBreadcrumbSection, soilsBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  soilsBreadcrumbSection,
  {
    label: "Surface perméable",
    contentState: {
      sectionName: mainBreadcrumbSection.contentState.sectionName,
      impactName: "permeable_surface_area",
    },
  },
] as const;
