import { AvoidedFricheCostsIndirectEconomicImpactItemView } from "shared";

import { SocioEconomicSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import { BreadcrumbProps } from "@/features/projects/views/shared/impacts/modals/ModalBreadcrumb";

import {
  mainBreadcrumbSection,
  localAuthorityBreadcrumbSection,
  localPeopleOrCompanyBreadcrumbSection,
} from "../breadcrumbSections";

export const getBreadcrumbSegments = (
  subSectionName: SocioEconomicSubSectionName,
  impactName: AvoidedFricheCostsIndirectEconomicImpactItemView["name"],
): BreadcrumbProps["segments"] =>
  [
    mainBreadcrumbSection,
    subSectionName === "localAuthority"
      ? localAuthorityBreadcrumbSection
      : localPeopleOrCompanyBreadcrumbSection,
    {
      label: "Dépenses friche évitées",
      contentState: {
        sectionName: mainBreadcrumbSection.contentState.sectionName,
        subSectionName: subSectionName,
        impactName: impactName,
      },
    },
  ] as const;
