import { EconomicBalanceImpactDescriptionModalId } from "./types";

export const getEconomicBalanceSectionModalTitle = (
  modalId: EconomicBalanceImpactDescriptionModalId,
) => {
  switch (modalId) {
    case "economic-balance":
      return "📉 Bilan de l'opération";
    case "economic-balance.real-estate-acquisition":
      return "🏠 Acquisition du site";
  }
};
