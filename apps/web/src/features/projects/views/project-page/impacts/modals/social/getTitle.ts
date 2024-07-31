import { SocialImpactDescriptionModalId } from "./types";

export const getSocialSectionModalTitle = (modalId: SocialImpactDescriptionModalId) => {
  switch (modalId) {
    case "social":
      return "🌍 Impacts sociaux";
    case "social.households-powered-by-renewable-energy":
      return "🏠 Foyers alimentés par les EnR";
  }
};
