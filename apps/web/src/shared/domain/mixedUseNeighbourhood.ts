export type ProjectPhase =
  | "setup"
  | "planning"
  | "design"
  | "construction"
  | "completed"
  | "unknown";

export type MixedUseNeighbourhoodSpace =
  // private spaces
  | "BUILDINGS_FOOTPRINT" // emprise au sol bâti = surface occupée au sol par les bâtiments
  | "PRIVATE_PAVED_ALLEY_OR_PARKING_LOT"
  | "PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT"
  | "PRIVATE_GARDEN_AND_GRASS_ALLEYS"
  // public spaces
  | "PUBLIC_GREEN_SPACES"
  | "PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS"
  | "PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS"
  | "PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS"
  | "PUBLIC_PARKING_LOT";

export const getLabelForMixedUseNeighbourhoodSpace = (
  space: MixedUseNeighbourhoodSpace,
): string => {
  switch (space) {
    case "BUILDINGS_FOOTPRINT":
      return "Emprise au sol bâti";
    case "PRIVATE_PAVED_ALLEY_OR_PARKING_LOT":
      return "Allée ou parking privé bitumé";
    case "PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT":
      return "Allée ou parking privé en gravier";
    case "PRIVATE_GARDEN_AND_GRASS_ALLEYS":
      return "Jardin et allées enherbées privées";
    case "PUBLIC_GREEN_SPACES":
      return "Espaces verts publics";
    case "PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS":
      return "Voies, places, trottoirs bitumés";
    case "PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS":
      return "Voies, places, trottoirs en gravier";
    case "PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS":
      return "Voies, places, trottoirs enherbés";
    case "PUBLIC_PARKING_LOT":
      return "Parking public";
  }
};

export type MixedUseNeighbourhoodDevelopmentExpense = {
  amount: number;
  purpose: "technical_studies" | "development_works" | "other";
};

export const getLabelForMixedUseNeighbourhoodDevelopmentExpense = (
  expensePurpose: MixedUseNeighbourhoodDevelopmentExpense["purpose"],
): string => {
  switch (expensePurpose) {
    case "technical_studies":
      return "📋 Études et honoraires techniques";
    case "development_works":
      return "🏗 Travaux d'aménagement";
    case "other":
      return " 🏘 Autres dépenses d'aménagement";
  }
};
