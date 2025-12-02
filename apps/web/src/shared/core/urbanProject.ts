import { BuildingsUse, UrbanProjectDevelopmentExpense, SoilType } from "shared";

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

export const getLabelForBuildingsUse = (use: BuildingsUse): string => {
  switch (use) {
    case "LOCAL_STORE":
      return "Commerce de proximité";
    case "LOCAL_SERVICES":
      return "Service de proximité";
    case "PUBLIC_FACILITIES":
      return "Équipements publics";
    case "RESIDENTIAL":
      return "Logements";
    case "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES":
      return "Locaux industriels, artisanaux ou logistiques";
    case "OFFICES":
      return "Bureaux";
    case "MULTI_STORY_PARKING":
      return "Parking silo";
    case "CULTURAL_PLACE":
      return "Lieux culturels";
    case "SPORTS_FACILITIES":
      return "Équipements sportifs";
    case "OTHER":
      return "Autres usages";
  }
};

export const getColorForBuildingsUse = (use: BuildingsUse): string => {
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
    case "CULTURAL_PLACE":
      return "#EB7F14";
    case "OFFICES":
      return "#7A13EB";
    case "PUBLIC_FACILITIES":
      return "#68699E";
    case "OTHER":
      return "#9D6B6B";
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
