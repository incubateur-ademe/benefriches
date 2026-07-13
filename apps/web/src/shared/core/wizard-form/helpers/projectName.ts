import { ReconversionProjectCreationData } from "../../../../features/create-project/core/project.types";
import { getLabelForRenewableEnergyProductionType } from "../../../../features/create-project/views/projectTypeLabelMapping";

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
