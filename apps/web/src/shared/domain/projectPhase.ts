import { ProjectPhase } from "shared";

export const getLabelForProjectPhase = (projectPhase: ProjectPhase): string => {
  switch (projectPhase) {
    case "setup":
      return "Développement";
    case "design":
      return "Ingénierie";
    case "construction":
      return "Construction";
    case "planning":
      return "Programmation";
    case "completed":
      return "Projet achevé";
    case "unknown":
      return "Autre/Ne sait pas";
  }
};

export const getHintTextForProjectPhase = (projectPhase: ProjectPhase): string | null => {
  switch (projectPhase) {
    case "setup":
      return "Recherche de site, faisabilité, concertation locale, éude d'impact, dépôt de permis";
    default:
      return null;
  }
};
