import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "../views/projectTypeLabelMapping";
import { Project } from "./project.types";

export type ProjectInfo = Pick<Project, "developmentPlanCategory" | "renewableEnergyTypes">;

const generateRenewableEnergyProjectName = (
  renewableEnergyTypes: ProjectInfo["renewableEnergyTypes"],
): string => {
  if (renewableEnergyTypes.length === 1) {
    return `Projet ${getLabelForRenewableEnergyProductionType(renewableEnergyTypes[0]!).toLowerCase()}`;
  }
  return "Projet EnR mixte";
};

export const generateProjectName = (projectData: ProjectInfo): string => {
  if (
    projectData.developmentPlanCategory.length === 0 ||
    projectData.developmentPlanCategory.length > 1
  )
    return "Projet mixte";

  const projectType = projectData.developmentPlanCategory[0]!;

  switch (projectType) {
    case "BUILDINGS":
    case "NATURAL_URBAN_SPACES":
    case "URBAN_AGRICULTURE":
      return `Projet ${getLabelForDevelopmentPlanCategory(projectData.developmentPlanCategory[0]!).toLowerCase()}`;
    case "RENEWABLE_ENERGY":
      return generateRenewableEnergyProjectName(projectData.renewableEnergyTypes);
  }
};
