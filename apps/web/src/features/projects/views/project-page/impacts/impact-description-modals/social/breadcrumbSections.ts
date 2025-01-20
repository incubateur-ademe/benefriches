import { SocialSubSectionName } from "../ImpactModalDescriptionContext";

export const mainBreadcrumbSection = {
  label: "Impacts sociaux",
  openState: { sectionName: "social" },
} as const;

export const jobsBreadcrumbSection = {
  label: "Impacts sur l'emploi",
  openState: { sectionName: "social", subSectionName: "jobs" },
} as const;

export const localPeopleBreadcrumbSection = {
  label: "Impacts sur la population locale",
  openState: { sectionName: "social", subSectionName: "local_people" },
} as const;

export const frenchSocietyBreadcrumbSection = {
  label: "Impacts sur la société française",
  openState: { sectionName: "social", subSectionName: "french_society" },
} as const;

export const getSubSectionBreadcrumb = (subSectionName: SocialSubSectionName) => {
  switch (subSectionName) {
    case "french_society":
      return frenchSocietyBreadcrumbSection;
    case "jobs":
      return jobsBreadcrumbSection;
    case "local_people":
      return localPeopleBreadcrumbSection;
  }
};
