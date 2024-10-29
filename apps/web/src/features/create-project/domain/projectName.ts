import { DevelopmentPlanCategory } from "shared";

import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "../views/projectTypeLabelMapping";
import { ReconversionProjectCreationData } from "./project.types";

export type ProjectInfo = Pick<ReconversionProjectCreationData, "renewableEnergyType">;

const generateRenewableEnergyProjectName = (
  renewableEnergyType: ProjectInfo["renewableEnergyType"],
): string => {
  if (renewableEnergyType === "PHOTOVOLTAIC_POWER_PLANT") {
    return "Centrale photovoltaïque";
  }
  return `Projet ${getLabelForRenewableEnergyProductionType(renewableEnergyType).toLowerCase()}`;
};

export const generateProjectName = (
  developmentPlanCategory: DevelopmentPlanCategory,
  projectData: ProjectInfo,
): string => {
  switch (developmentPlanCategory) {
    case "URBAN_PROJECT":
    case "NATURAL_URBAN_SPACES":
    case "URBAN_AGRICULTURE":
    case "COMMERCIAL_ACTIVITY_AREA":
      return `Projet ${getLabelForDevelopmentPlanCategory(developmentPlanCategory).toLowerCase()}`;
    case "RENEWABLE_ENERGY":
      return generateRenewableEnergyProjectName(projectData.renewableEnergyType);
  }
};
