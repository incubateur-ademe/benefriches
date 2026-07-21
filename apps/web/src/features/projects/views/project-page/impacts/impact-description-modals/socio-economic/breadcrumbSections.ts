import { SocioEconomicSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

export const mainBreadcrumbSection = {
  label: "Impacts socio-économiques",
  contentState: { sectionName: "socio_economic" },
} as const;

export const humanityBreadcrumbSection = {
  label: "Impacts pour la société française et mondiale",
  contentState: { sectionName: "socio_economic", subSectionName: "humanity" },
} as const;

export const localPeopleOrCompanyBreadcrumbSection = {
  label: "Impacts pour les riverains",
  contentState: { sectionName: "socio_economic", subSectionName: "localPeopleOrCompany" },
} as const;

export const localAuthorityBreadcrumbSection = {
  label: "Impacts pour la collectivité locale",
  contentState: { sectionName: "socio_economic", subSectionName: "localAuthority" },
} as const;

export const getSubSectionBreadcrumb = (subSectionName: SocioEconomicSubSectionName) => {
  switch (subSectionName) {
    case "humanity":
      return humanityBreadcrumbSection;
    case "localAuthority":
      return localAuthorityBreadcrumbSection;
    case "localPeopleOrCompany":
      return localPeopleOrCompanyBreadcrumbSection;
  }
};
