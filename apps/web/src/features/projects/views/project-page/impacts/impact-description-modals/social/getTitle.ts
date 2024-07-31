import { SocialImpactDescriptionModalId } from "./types";

export const getSocialSectionModalTitle = (modalId: SocialImpactDescriptionModalId) => {
  switch (modalId) {
    case "social":
      return "🌍 Impacts sociaux";
    case "social.households-powered-by-renewable-energy":
      return "🏠 Foyers alimentés par les EnR";
    case "social.avoided-vehicule-kilometers":
      return "🚙 Kilomètres évités";
    case "social.time-travel-saved":
      return "⏱ Temps de déplacement économisé";
  }
};
