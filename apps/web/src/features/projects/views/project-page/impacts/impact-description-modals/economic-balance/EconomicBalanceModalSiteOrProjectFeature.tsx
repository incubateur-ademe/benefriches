import { isForest, isImpermeableSoil, SoilType, sumListWithKey } from "shared";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import ImpactItemGroup from "../../list-view/ImpactItemGroup";

type SoilsDistributionItem = {
  total: number;
  soilType: SoilType;
};

type FeatureValue =
  | "impermeableSurfaceArea"
  | "artificialGrassSurfaceArea"
  | "treeSurfaceArea"
  | "buildingsSurfaceArea"
  | "siteSurfaceArea";

const getSurfaceArea = (
  value: FeatureValue,
  {
    siteSurfaceArea,
    soilsDistribution,
  }: {
    siteSurfaceArea: number;
    soilsDistribution: SoilsDistributionItem[];
  },
): number => {
  switch (value) {
    case "impermeableSurfaceArea":
      return sumListWithKey(
        soilsDistribution.filter(({ soilType }) => isImpermeableSoil(soilType)),
        "total",
      );
    case "artificialGrassSurfaceArea":
      return sumListWithKey(
        soilsDistribution.filter((item) => item.soilType === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED"),
        "total",
      );
    case "treeSurfaceArea":
      return sumListWithKey(
        soilsDistribution.filter(({ soilType }) => isForest(soilType)),
        "total",
      );
    case "buildingsSurfaceArea":
      return sumListWithKey(
        soilsDistribution.filter((item) => item.soilType === "BUILDINGS"),
        "total",
      );
    case "siteSurfaceArea":
      return siteSurfaceArea;
  }
};

const ModalSiteOrProjectFeature = ({
  value,
  label,
  siteSurfaceArea,
  soilsDistribution,
}: {
  value: FeatureValue;
  label: string;
  siteSurfaceArea: number;
  soilsDistribution: SoilsDistributionItem[];
}) => {
  const total = getSurfaceArea(value, { siteSurfaceArea, soilsDistribution });

  return (
    <ImpactItemGroup className="max-w-1/3 py-3 flex justify-between">
      <span>{label}</span>
      <span>{formatNumberFr(total)} m²</span>
    </ImpactItemGroup>
  );
};

export default ModalSiteOrProjectFeature;
