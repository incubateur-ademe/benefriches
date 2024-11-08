import {
  BuildingFloorAreaUsageDistribution,
  UrbanProjectDevelopmentExpense,
  UrbanProjectSpace,
} from "shared";

export const getLabelForUrbanProjectSpace = (space: UrbanProjectSpace): string => {
  switch (space) {
    case "BUILDINGS_FOOTPRINT":
      return "Emprise au sol bâti";
    case "PRIVATE_PAVED_ALLEY_OR_PARKING_LOT":
      return "Allée ou parking privé bitumé";
    case "PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT":
      return "Allée ou parking privé en gravier";
    case "PRIVATE_GARDEN_AND_GRASS_ALLEYS":
      return "Jardins et allées enherbées privées";
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
    case "PRIVATE_TREE_FILLED_GARDEN_AND_ALLEYS":
      return "Jardins ou allées arborés privés";
  }
};

export const getLabelForBuildingFloorArea = (
  building: keyof BuildingFloorAreaUsageDistribution,
): string => {
  switch (building) {
    case "GROUND_FLOOR_RETAIL":
      return "Commerces pied d’immeuble";
    case "NEIGHBOURHOOD_FACILITIES_AND_SERVICES":
      return "Services et équipements de proximité";
    case "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS":
      return "Locaux d'artisanat ou commerciaux (hors pied d'immeuble)";
    case "PUBLIC_FACILITIES":
      return "Équipements publics";
    case "RESIDENTIAL":
      return "Habitations";
    case "SHIPPING_OR_INDUSTRIAL_BUILDINGS":
      return "Locaux industriels ou logistiques";
    case "TERTIARY_ACTIVITIES":
      return "Tertiaire";
    case "MULTI_STORY_PARKING":
      return "Parking silo";
    case "OTHER":
      return "Autres";
  }
};

export const getLabelForUrbanProjectDevelopmentExpense = (
  expensePurpose: UrbanProjectDevelopmentExpense["purpose"],
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
