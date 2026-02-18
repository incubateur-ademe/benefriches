import { UrbanProjectUseWithBuilding, UrbanProjectDevelopmentExpense, SoilType } from "shared";

export const getUrbanSpaceLabelForLivingAndActivitySpace = (soilType: SoilType): string => {
  switch (soilType) {
    case "BUILDINGS":
      return "Emprise au sol bâti";
    case "IMPERMEABLE_SOILS":
      return "Allée ou parking privé bitumé";
    case "MINERAL_SOIL":
      return "Allée ou parking privé en gravier";
    case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
    case "ARTIFICIAL_TREE_FILLED":
      return "Espaces verts privés";
    default:
      return "Autres espaces privés";
  }
};

export const getUrbanSpaceLabelForPublicSpace = (soilType: SoilType): string => {
  switch (soilType) {
    case "IMPERMEABLE_SOILS":
      return "Voies, places, trottoirs ou parking bitumés";
    case "MINERAL_SOIL":
      return "Voies, places, trottoirs en gravier";
    case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
      return "Voies, places, trottoirs enherbés";
    default:
      return "Autres espaces publics";
  }
};

export const getLabelForBuildingsUse = (use: UrbanProjectUseWithBuilding): string => {
  switch (use) {
    case "LOCAL_STORE":
      return "Commerce de proximité";
    case "LOCAL_SERVICES":
      return "Service de proximité";
    case "PUBLIC_FACILITIES":
      return "Autres bâtiments publics";
    case "RESIDENTIAL":
      return "Logements";
    case "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES":
      return "Locaux industriels, artisanaux ou logistiques";
    case "OFFICES":
      return "Bureaux";
    case "MULTI_STORY_PARKING":
      return "Parking silo";
    case "OTHER_CULTURAL_PLACE":
      return "Autres lieux culturels";
    case "SPORTS_FACILITIES":
      return "Équipements sportifs";
    case "OTHER_BUILDING":
      return "Autres bâtiments";
    // Educational facilities
    case "KINDERGARTEN_OR_PRIMARY_SCHOOL":
      return "Crèche, école maternelle ou élémentaire";
    case "SECONDARY_SCHOOL":
      return "Collège ou lycée";
    case "OTHER_EDUCATIONAL_FACILITY":
      return "Autre établissement éducatif";
    // Health facilities
    case "LOCAL_HEALTH_SERVICE":
      return "Service de santé de proximité";
    case "HOSPITAL":
      return "Établissement hospitalier";
    case "MEDICAL_SOCIAL_FACILITY":
      return "Établissement médico-social";
    // Leisure and culture facilities
    case "CINEMA":
      return "Cinéma";
    case "MUSEUM":
      return "Musée";
    case "THEATER":
      return "Théâtre";
    case "RECREATIONAL_FACILITY":
      return "Équipement récréatif";
  }
};

export const getColorForBuildingsUse = (use: UrbanProjectUseWithBuilding): string => {
  switch (use) {
    case "RESIDENTIAL":
      return "#EA1447";
    case "LOCAL_STORE":
      return "#7BEB13";
    case "MULTI_STORY_PARKING":
      return "#609596";
    case "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES":
      return "#EB13BE";
    case "SPORTS_FACILITIES":
      return "#689E6A";
    case "LOCAL_SERVICES":
      return "#137FEB";
    case "OTHER_CULTURAL_PLACE":
      return "#EB7F14";
    case "OFFICES":
      return "#7A13EB";
    case "PUBLIC_FACILITIES":
      return "#68699E";
    case "OTHER_BUILDING":
      return "#9D6B6B";
    // Educational facilities
    case "KINDERGARTEN_OR_PRIMARY_SCHOOL":
      return "#4A90D9";
    case "SECONDARY_SCHOOL":
      return "#2E5F8A";
    case "OTHER_EDUCATIONAL_FACILITY":
      return "#6B9FCE";
    // Health facilities
    case "LOCAL_HEALTH_SERVICE":
      return "#E55B5B";
    case "HOSPITAL":
      return "#C43C3C";
    case "MEDICAL_SOCIAL_FACILITY":
      return "#F08080";
    // Leisure and culture facilities
    case "CINEMA":
      return "#D4A017";
    case "MUSEUM":
      return "#B8860B";
    case "THEATER":
      return "#DAA520";
    case "RECREATIONAL_FACILITY":
      return "#F4C430";
  }
};

export const getLabelForUrbanProjectDevelopmentExpense = (
  expensePurpose: UrbanProjectDevelopmentExpense["purpose"],
): string => {
  switch (expensePurpose) {
    case "technical_studies":
      return "📋 Études et honoraires techniques";
    case "development_works":
      return "🏗️️ Travaux d'aménagement";
    case "other":
      return "🏘️️ Autres dépenses d'aménagement";
  }
};
