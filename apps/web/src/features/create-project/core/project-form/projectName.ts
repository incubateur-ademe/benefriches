import { ReconversionProjectCreationData } from "../project.types";
import { getLabelForRenewableEnergyProductionType } from "./renewableEnergyLabelMapping";

type ProjectInfo = Pick<ReconversionProjectCreationData, "renewableEnergyType">;

export const generateRenewableEnergyProjectName = (
  renewableEnergyType: ProjectInfo["renewableEnergyType"],
): string => {
  if (renewableEnergyType === "PHOTOVOLTAIC_POWER_PLANT") {
    return "Centrale photovoltaïque";
  }
  return `Projet ${getLabelForRenewableEnergyProductionType(renewableEnergyType).toLowerCase()}`;
};

export const generateUrbanProjectName = (): string => {
  return "Projet urbain mixte";
};
