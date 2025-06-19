import { SocioEconomicSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

export const mainBreadcrumbSection = {
  label: "Impacts socio-économiques",
  contentState: { sectionName: "socio_economic" },
} as const;

export const environmentalMonetaryBreadcrumbSection = {
  label: "Impacts environnementaux monétarisés",
  contentState: { sectionName: "socio_economic", subSectionName: "environmental_monetary" },
} as const;

export const socialMonetaryBreadcrumbSection = {
  label: "Impacts sociaux monétarisés",
  contentState: { sectionName: "socio_economic", subSectionName: "social_monetary" },
} as const;

export const economicDirectBreadcrumbSection = {
  label: "Impacts économiques directs",
  contentState: { sectionName: "socio_economic", subSectionName: "economic_direct" },
} as const;

export const economicIndirectBreadcrumbSection = {
  label: "Impacts économiques indirects",
  contentState: { sectionName: "socio_economic", subSectionName: "economic_indirect" },
} as const;

export const getSubSectionBreadcrumb = (subSectionName: SocioEconomicSubSectionName) => {
  switch (subSectionName) {
    case "economic_direct":
      return economicDirectBreadcrumbSection;
    case "economic_indirect":
      return economicIndirectBreadcrumbSection;
    case "social_monetary":
      return socialMonetaryBreadcrumbSection;
    case "environmental_monetary":
      return environmentalMonetaryBreadcrumbSection;
  }
};
