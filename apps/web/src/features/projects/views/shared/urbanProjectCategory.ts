import { BUILDINGS_ECONOMIC_ACTIVITY_USE, BuildingsUse, typedObjectEntries } from "shared";

import { UrbanProjectFeatures } from "../../domain/projects.types";

const PUBLIC_FACILITIES = [
  "PUBLIC_FACILITIES",
  "CULTURAL_PLACE",
  "SPORTS_FACILITIES",
] as const satisfies BuildingsUse[];

type UrbanProjectCategory =
  | "PUBLIC_FACILITIES"
  | "RESIDENTIAL_TENSE_AREA"
  | "RESIDENTIAL_NORMAL_AREA"
  | "NEW_URBAN_CENTER"
  | "OTHER";

type Props = {
  buildingsUseDistribution: UrbanProjectFeatures["buildingsFloorAreaDistribution"];
  spacesDistribution: UrbanProjectFeatures["spacesDistribution"];
};

export const getUrbanProjectCategoryFromFeatures = ({
  buildingsUseDistribution,
  spacesDistribution,
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

  if (
    hasPublicFacilities ||
    (spacesDistribution.PUBLIC_GREEN_SPACES && spacesDistribution.PUBLIC_GREEN_SPACES > 0)
  ) {
    return "PUBLIC_FACILITIES";
  }

  return "OTHER";
};

export const getLabelForUrbanProjectCategory = (category: UrbanProjectCategory) => {
  switch (category) {
    case "NEW_URBAN_CENTER":
      return "Centralité urbaine";
    case "PUBLIC_FACILITIES":
      return "Équipement public";
    case "RESIDENTIAL_NORMAL_AREA":
      return "Résidentiel secteur détendu";
    case "RESIDENTIAL_TENSE_AREA":
      return "Résidentiel secteur tendu";
    case "OTHER":
      return "Projet urbain";
  }
};
