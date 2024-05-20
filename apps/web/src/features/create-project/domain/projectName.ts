import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "../views/projectTypeLabelMapping";
import { ReconversionProjectCreationData } from "./project.types";

export type ProjectInfo = Pick<
  ReconversionProjectCreationData,
  "developmentPlanCategories" | "renewableEnergyTypes"
>;

const generateRenewableEnergyProjectName = (
  renewableEnergyTypes: ProjectInfo["renewableEnergyTypes"],
): string => {
  if (renewableEnergyTypes.length === 1) {
    const [renewableEnergyType] = renewableEnergyTypes;
    if (renewableEnergyType === "PHOTOVOLTAIC_POWER_PLANT") {
      return "Centrale photovoltaïque";
    }
    return `Projet ${getLabelForRenewableEnergyProductionType(renewableEnergyType!).toLowerCase()}`;
  }
  return "Projet EnR mixte";
};

export const generateProjectName = (projectData: ProjectInfo): string => {
  if (
    projectData.developmentPlanCategories.length === 0 ||
    projectData.developmentPlanCategories.length > 1
  )
    return "Projet mixte";

  const projectType = projectData.developmentPlanCategories[0]!;

  switch (projectType) {
    case "BUILDINGS":
    case "NATURAL_URBAN_SPACES":
    case "URBAN_AGRICULTURE":
    case "COMMERCIAL_ACTIVITY_AREA":
      return `Projet ${getLabelForDevelopmentPlanCategory(projectData.developmentPlanCategories[0]!).toLowerCase()}`;
    case "RENEWABLE_ENERGY":
      return generateRenewableEnergyProjectName(projectData.renewableEnergyTypes);
  }
};
