export type AgriculturalOperationActivity =
  | "CEREALS_AND_OILSEEDS_CULTIVATION"
  | "LARGE_VEGETABLE_CULTIVATION"
  | "MARKET_GARDENING"
  | "FLOWERS_AND_HORTICULTURE"
  | "VITICULTURE"
  | "FRUITS_AND_OTHER_PERMANENT_CROPS"
  | "CATTLE_FARMING"
  | "PIG_FARMING"
  | "POULTRY_FARMING"
  | "SHEEP_AND_GOAT_FARMING"
  | "OTHER_HERBIVORES_FARMING"
  | "POLYCULTURE_AND_LIVESTOCK";

export function getLabelForAgriculturalOperationActivity(
  operationActivity: AgriculturalOperationActivity,
): string {
  switch (operationActivity) {
    case "CEREALS_AND_OILSEEDS_CULTIVATION":
      return "Grandes cultures de céréales et oléagineux";
    case "LARGE_VEGETABLE_CULTIVATION":
      return "Grandes cultures légumières";
    case "MARKET_GARDENING":
      return "Maraîchage";
    case "FLOWERS_AND_HORTICULTURE":
      return "Fleurs et horticulture diverses";
    case "VITICULTURE":
      return "Viticulture";
    case "FRUITS_AND_OTHER_PERMANENT_CROPS":
      return "Fruits et autres cultures permanentes";
    case "CATTLE_FARMING":
      return "Élevage bovin";
    case "PIG_FARMING":
      return "Élevage porcin";
    case "POULTRY_FARMING":
      return "Élevage de volailles et granivores";
    case "SHEEP_AND_GOAT_FARMING":
      return "Élevage ovin et caprin";
    case "OTHER_HERBIVORES_FARMING":
      return "Autres élevages herbivores";
    case "POLYCULTURE_AND_LIVESTOCK":
      return "Polyculture / polyélevage";
  }
}
