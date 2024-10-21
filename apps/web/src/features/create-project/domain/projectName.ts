import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "../views/projectTypeLabelMapping";
import { ReconversionProjectCreationData } from "./project.types";

export type ProjectInfo = Pick<
  ReconversionProjectCreationData,
  "developmentPlanCategory" | "renewableEnergyType"
>;

const generateRenewableEnergyProjectName = (
  renewableEnergyType: ProjectInfo["renewableEnergyType"],
): string => {
  if (renewableEnergyType === "PHOTOVOLTAIC_POWER_PLANT") {
    return "Centrale photovoltaïque";
  }
  return `Projet ${getLabelForRenewableEnergyProductionType(renewableEnergyType).toLowerCase()}`;
};

export const generateProjectName = (projectData: ProjectInfo): string => {
  switch (projectData.developmentPlanCategory) {
    case "URBAN_BUILDINGS":
    case "NATURAL_URBAN_SPACES":
    case "URBAN_AGRICULTURE":
    case "COMMERCIAL_ACTIVITY_AREA":
      return `Projet ${getLabelForDevelopmentPlanCategory(projectData.developmentPlanCategory).toLowerCase()}`;
    case "RENEWABLE_ENERGY":
      return generateRenewableEnergyProjectName(projectData.renewableEnergyType);
  }
};
