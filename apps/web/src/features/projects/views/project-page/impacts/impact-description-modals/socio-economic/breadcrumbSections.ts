import { SocioEconomicSubSectionName } from "../ImpactModalDescriptionContext";

export const mainBreadcrumbSection = {
  label: "Impacts socio-économiques",
  openState: { sectionName: "socio_economic" },
} as const;

export const environmentalMonetaryBreadcrumbSection = {
  label: "Impacts environnementaux monétarisés",
  openState: { sectionName: "socio_economic", subSectionName: "environmental_monetary" },
} as const;

export const socialMonetaryBreadcrumbSection = {
  label: "Impacts sociaux monétarisés",
  openState: { sectionName: "socio_economic", subSectionName: "social_monetary" },
} as const;

export const economicDirectMonetaryBreadcrumbSection = {
  label: "Impacts économiques directs",
  openState: { sectionName: "socio_economic", subSectionName: "economic_direct" },
} as const;

export const economicIndirectMonetaryBreadcrumbSection = {
  label: "Impacts économiques indirects",
  openState: { sectionName: "socio_economic", subSectionName: "economic_indirect" },
} as const;

export const getSubSectionBreadcrumb = (subSectionName: SocioEconomicSubSectionName) => {
  switch (subSectionName) {
    case "economic_direct":
      return economicDirectMonetaryBreadcrumbSection;
    case "economic_indirect":
      return economicIndirectMonetaryBreadcrumbSection;
    case "social_monetary":
      return socialMonetaryBreadcrumbSection;
    case "environmental_monetary":
      return environmentalMonetaryBreadcrumbSection;
  }
};
