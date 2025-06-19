import { BreadcrumbProps } from "@/features/projects/views/shared/impacts/modals/ModalBreadcrumb";

import {
  mainBreadcrumbSection,
  environmentalMonetaryBreadcrumbSection,
} from "../breadcrumbSections";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  mainBreadcrumbSection,
  environmentalMonetaryBreadcrumbSection,
  {
    label: "Valeur monétaire des services écosystémiques",
    contentState: {
      sectionName: mainBreadcrumbSection.contentState.sectionName,
      impactName: "ecosystem_services",
    },
  },
] as const;
