import { BreadcrumbProps } from "@/features/projects/views/shared/impacts/modals/ModalBreadcrumb";

import { mainBreadcrumbSection, jobsBreadcrumbSection } from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  jobsBreadcrumbSection,
  {
    label: "Emplois équivalent temps plein",
    contentState: {
      sectionName: mainBreadcrumbSection.contentState.sectionName,
      impactName: "full_time_jobs",
    },
  },
] as const;
