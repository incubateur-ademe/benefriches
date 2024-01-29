import {
  getLabelForProjectType,
  getLabelForRenewableEnergyType,
} from "../views/projectTypeLabelMapping";
import { Project, ProjectType } from "./project.types";

type ProjectInfo = Pick<Project, "types" | "renewableEnergyTypes">;

const generateRenewableEnergyProjectName = (
  renewableEnergyTypes: ProjectInfo["renewableEnergyTypes"],
): string => {
  if (renewableEnergyTypes.length === 1) {
    return `Projet ${getLabelForRenewableEnergyType(renewableEnergyTypes[0]!).toLowerCase()}`;
  }
  return "Projet EnR mixte";
};

export const generateProjectName = (projectData: ProjectInfo): string => {
  if (projectData.types.length === 0 || projectData.types.length > 1) return "Projet mixte";

  const projectType = projectData.types[0]!;

  switch (projectType) {
    case ProjectType.BUILDINGS:
    case ProjectType.NATURAL_URBAN_SPACES:
    case ProjectType.URBAN_AGRICULTURE:
      return `Projet ${getLabelForProjectType(projectData.types[0]!).toLowerCase()}`;
    case ProjectType.RENEWABLE_ENERGY:
      return generateRenewableEnergyProjectName(projectData.renewableEnergyTypes);
  }
};
