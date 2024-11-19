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
    case "planning":
      return "Au sens de la loi sur la maîtrise d'ouvrage publique, sont définis dans le cadre du  programme : les objectifs de l'opération et les besoins qu'elle doit satisfaire ainsi que les contraintes et exigences de qualité sociale, urbanistique, architecturale, fonctionnelle, technique et économique, d'insertion dans le paysage et de protection de l'environnement, relatives à la réalisation et à l'utilisation de l'ouvrage.";
    default:
      return null;
  }
};
