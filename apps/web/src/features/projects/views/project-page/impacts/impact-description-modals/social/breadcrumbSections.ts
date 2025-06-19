import { SocialSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

export const mainBreadcrumbSection = {
  label: "Impacts sociaux",
  contentState: { sectionName: "social" },
} as const;

export const jobsBreadcrumbSection = {
  label: "Impacts sur l'emploi",
  contentState: { sectionName: "social", subSectionName: "jobs" },
} as const;

export const localPeopleBreadcrumbSection = {
  label: "Impacts sur la population locale",
  contentState: { sectionName: "social", subSectionName: "local_people" },
} as const;

export const frenchSocietyBreadcrumbSection = {
  label: "Impacts sur la société française",
  contentState: { sectionName: "social", subSectionName: "french_society" },
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
