import { EconomicBalanceImpactDescriptionModalId } from "./types";

export const getEconomicBalanceSectionModalTitle = (
  modalId: EconomicBalanceImpactDescriptionModalId,
) => {
  switch (modalId) {
    case "economic-balance":
      return "📉 Bilan de l'opération";
    case "economic-balance.site-reinstatement":
      return "🚧 Remise en état de la friche";
    case "economic-balance.real-estate-acquisition":
      return "🏠 Acquisition du site";
  }
};
