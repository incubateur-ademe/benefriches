import { EnvironmentSubSectionName } from "../ImpactModalDescriptionContext";

export const mainBreadcrumbSection = {
  label: "Impacts environnementaux",
  openState: { sectionName: "environmental" },
} as const;

export const soilsBreadcrumbSection = {
  label: "Impacts sur les sols",
  openState: { sectionName: "environmental", subSectionName: "soils" },
} as const;

export const co2BreadcrumbSection = {
  label: "Impacts sur le CO2-eq",
  openState: { sectionName: "environmental", subSectionName: "co2" },
} as const;

export const getSubSectionBreadcrumb = (subSectionName: EnvironmentSubSectionName) => {
  switch (subSectionName) {
    case "co2":
      return co2BreadcrumbSection;
    case "soils":
      return soilsBreadcrumbSection;
  }
};
