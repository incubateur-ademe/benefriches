import { RenewableEnergyProjectPhase, UrbanProjectPhase } from "shared";

export const getLabelForUrbanProjectPhase = (projectPhase: UrbanProjectPhase): string => {
  switch (projectPhase) {
    case "setup":
      return "Montage";
    case "planning":
      return "Programmation";
    case "design":
      return "Conception";
    case "construction":
      return "Réalisation";
    case "completed":
      return "Projet achevé";
    case "unknown":
      return "Autre/Ne sait pas";
  }
};

export const getLabelForRenewableEnergyProjectPhase = (
  projectPhase: RenewableEnergyProjectPhase,
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

export const getHintTextForRenewableEnergyProjectPhase = (
  projectPhase: RenewableEnergyProjectPhase,
): string | undefined => {
  switch (projectPhase) {
    case "setup":
      return "Recherche de site, faisabilité, concertation locale, éude d'impact, dépôt de permis";
    case "design":
      return "Choix des équipements et des matériels, établissement du calendrier et du budget du projet, définition des tâches et des responsabilités, etc.";
    case "construction":
      return "Travaux de remise en état, d'aménagement ou de construction de la centrale";
    default:
      return undefined;
  }
};

export const getHintTextForUrbanProjectPhase = (
  projectPhase: UrbanProjectPhase,
): string | undefined => {
  switch (projectPhase) {
    case "setup":
      return "Prospection, étude d'opportunité de l'opération, identification et analyses de la faisabilité des différents scénarii, choix d'un scenario et de son processus de mise en oeuvre";
    case "planning":
      return "A cette étape, le maître d'ouvrage définit les objectifs de l'opération et les besoins qu'elle doit satisfaire ainsi que les contraintes et exigences de qualité sociale, urbanistique, architecturale, fonctionnelle, technique et économique, d'insertion dans le paysage et de protection de l'environnement, relatives à la réalisation et à l'utilisation de l'ouvrage.";
    case "design":
      return "Esquisse, avant-projet sommaire, avant-projet définitif, PRO, dépôt de permis, passation marchés, etc.";
    case "construction":
      return "Travaux de reconversion ou d'aménagement du site";
    default:
      return undefined;
  }
};
