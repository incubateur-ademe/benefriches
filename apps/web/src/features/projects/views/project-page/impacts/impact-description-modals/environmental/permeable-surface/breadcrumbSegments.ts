import { BreadcrumbProps } from "../../shared/ModalBreadcrumb";
import { breadcrumbSection } from "../breadcrumbSection";

export const breadcrumbSegments: BreadcrumbProps["segments"] = [
  breadcrumbSection,
  {
    label: "Surface perméable",
    openState: {
      sectionName: breadcrumbSection.openState.sectionName,
      impactName: "permeable_surface_area",
    },
  },
] as const;
