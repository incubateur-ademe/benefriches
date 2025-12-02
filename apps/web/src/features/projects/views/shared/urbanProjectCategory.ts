import {
  BUILDINGS_ECONOMIC_ACTIVITY_USE,
  BuildingsUse,
  ReconversionProjectSoilsDistribution,
  sumListWithKey,
  typedObjectEntries,
  UrbanProjectCategory,
} from "shared";

import { UrbanProjectFeatures } from "../../domain/projects.types";

const PUBLIC_FACILITIES = [
  "PUBLIC_FACILITIES",
  "CULTURAL_PLACE",
  "SPORTS_FACILITIES",
] as const satisfies BuildingsUse[];

type Props = {
  buildingsUseDistribution: UrbanProjectFeatures["buildingsFloorAreaDistribution"];
  soilsDistribution: ReconversionProjectSoilsDistribution;
};

export const getUrbanProjectCategoryFromFeatures = ({
  buildingsUseDistribution,
  soilsDistribution,
}: Props): UrbanProjectCategory => {
  const buildingsUses = typedObjectEntries(buildingsUseDistribution)
    .filter(([, value]) => value && value > 0)
    .map(([key]) => key);

  const hasResidential =
    buildingsUseDistribution.RESIDENTIAL && buildingsUseDistribution.RESIDENTIAL > 0;
  const hasEconomicActivity =
    BUILDINGS_ECONOMIC_ACTIVITY_USE.filter((key) => buildingsUses.includes(key)).length > 0;

  const hasPublicFacilities =
    PUBLIC_FACILITIES.filter((key) => buildingsUses.includes(key)).length > 0;

  const buildingsWithoutResidential = buildingsUses.filter((key) => key !== "RESIDENTIAL");

  if (hasResidential && buildingsWithoutResidential.length === 0) {
    return "RESIDENTIAL_NORMAL_AREA";
  }

  if (hasResidential && hasEconomicActivity && !hasPublicFacilities) {
    return "RESIDENTIAL_TENSE_AREA";
  }

  if (hasResidential && hasEconomicActivity && hasPublicFacilities) {
    return "NEW_URBAN_CENTER";
  }

  const hasPublicGreenSpaces =
    sumListWithKey(
      soilsDistribution.filter(({ spaceCategory }) => spaceCategory === "PUBLIC_GREEN_SPACE"),
      "surfaceArea",
    ) > 0;

  if (hasPublicFacilities || hasPublicGreenSpaces) {
    return "PUBLIC_FACILITIES";
  }

  return "OTHER";
};

export const getLabelForUrbanProjectCategory = (category: UrbanProjectCategory): string => {
  switch (category) {
    case "NEW_URBAN_CENTER":
      return "Centralité urbaine";
    case "PUBLIC_FACILITIES":
      return "Équipement public";
    case "RESIDENTIAL_NORMAL_AREA":
      return "Résidentiel secteur détendu";
    case "RESIDENTIAL_TENSE_AREA":
      return "Résidentiel secteur tendu";
    case "INDUSTRIAL_FACILITIES":
      return "Zone industrielle ou logistique";
    case "TOURISM_AND_CULTURAL_FACILITIES":
      return "Lieu culturel ou touristique";
    case "OFFICES":
      return "Bureaux";
    case "RENATURATION":
      return "Espace de nature";
    case "OTHER":
      return "Projet urbain";
  }
};

export const getPictogramForUrbanProjectCategory = (category: UrbanProjectCategory): string => {
  switch (category) {
    case "NEW_URBAN_CENTER":
      return "/img/pictograms/express-urban-categories/nouvelle-centralite.svg";
    case "PUBLIC_FACILITIES":
      return "/img/pictograms/express-urban-categories/equipement-public.svg";
    case "RESIDENTIAL_NORMAL_AREA":
      return "/img/pictograms/express-urban-categories/residentiel-secteur-detendu.svg";
    case "RESIDENTIAL_TENSE_AREA":
      return "/img/pictograms/express-urban-categories/residentiel-secteur-tendu.svg";
    case "INDUSTRIAL_FACILITIES":
      return "/img/pictograms/mutability-usages/industry.svg";
    case "OFFICES":
      return "/img/pictograms/mutability-usages/offices.svg";
    case "TOURISM_AND_CULTURAL_FACILITIES":
      return "/img/pictograms/mutability-usages/culture-and-tourism.svg";
    case "RENATURATION":
      return "/img/pictograms/mutability-usages/renaturation.svg";
    case "OTHER":
      return "/img/pictograms/express-urban-categories/projet-urbain.svg";
  }
};
