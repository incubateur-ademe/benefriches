import { ProjectPhase } from "shared";

export const getLabelForProjectPhase = (projectPhase: ProjectPhase): string => {
  switch (projectPhase) {
    case "setup":
      return "Montage / Développement";
    case "planning":
      return "Programmation";
    case "design":
      return "Conception / Ingénierie";
    case "construction":
      return "Réalisation / Construction";
    case "completed":
      return "Projet achevé";
    case "unknown":
      return "Autre/Ne sait pas";
  }
};

export const getHintTextForProjectPhase = (projectPhase: ProjectPhase): string | undefined => {
  switch (projectPhase) {
    case "setup":
      return "Prospection, étude d'opportunité de l'opération, identification et analyses de la faisabilité des différents scénarii, choix d'un scenario et de son processus de mise en oeuvre";
    case "planning":
      return "A cette étape, le maître d'ouvrage définit les objectifs de l'opération et les besoins qu'elle doit satisfaire ainsi que les contraintes et exigences de qualité sociale, urbanistique, architecturale, fonctionnelle, technique et économique, d'insertion dans le paysage et de protection de l'environnement, relatives à la réalisation et à l'utilisation de l'ouvrage.";
    case "design":
      return "Esquisse, avant-projet sommaire, avant-projet définitif, PRO, dépôt de permis, passation marchés, etc.";
    case "construction":
      return "Travaux de remise en état, de construction ou d'aménagement du site";
    default:
      return undefined;
  }
};

export const getPictogramForProjectPhase = (projectPhase: ProjectPhase): string | undefined => {
  switch (projectPhase) {
    case "setup":
      return "/img/pictograms/project-phase/setup-phase.svg";
    case "planning":
      return "/img/pictograms/project-phase/planning-phase.svg";
    case "design":
      return "/img/pictograms/project-phase/design-phase.svg";
    case "construction":
      return "/img/pictograms/project-phase/construction-phase.svg";
    case "completed":
      return "/img/pictograms/project-phase/completed-phase.svg";
    case "unknown":
      return undefined;
  }
};
