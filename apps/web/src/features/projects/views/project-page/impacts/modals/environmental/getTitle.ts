import { EnvironmentalImpactDescriptionModalId } from "./types";

export const getEnvironmentalSectionModalTitle = (
  modalId: EnvironmentalImpactDescriptionModalId,
) => {
  switch (modalId) {
    case "environmental":
      return "Impacts environnementaux";
    case "environmental.avoided-co2-renewable-energy":
      return "⚡️️ Emissions de CO2-eq évitées grâce à la production d'énergies renouvelables";
    case "environmental.carbon-storage":
      return "🍂️ Carbone stocké dans les sols";
    case "environmental.non-contamined-surface":
      return "✨ Surface non polluée";
    case "environmental.permeable-surface":
      return "🌧 Surface perméable";
    case "environmental.minerale-surface":
      return "🪨 Surface minérale";
    case "environmental.green-surface":
      return "☘️ Surface végétalisée";
  }
};
