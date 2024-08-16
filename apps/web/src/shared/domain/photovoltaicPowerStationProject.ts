import { ProjectPhase } from "shared";

type PhotovoltaicProjectPhase = Exclude<ProjectPhase, "planning">;

export const getLabelForPhotovoltaicProjectPhase = (
  projectPhase: PhotovoltaicProjectPhase,
): string => {
  switch (projectPhase) {
    case "setup":
      return "Développement";
    case "design":
      return "Ingénierie";
    case "construction":
      return "Construction";
    case "completed":
      return "Projet achevé";
    case "unknown":
      return "Autre/Ne sait pas";
  }
};

export const getHintTextForPhotovoltaicProjectPhase = (
  projectPhase: PhotovoltaicProjectPhase,
): string | null => {
  switch (projectPhase) {
    case "setup":
      return "Recherche de site, faisabilité, concertation locale, éude d'impact, dépôt de permis";
    default:
      return null;
  }
};
