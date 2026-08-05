import {
  isForest,
  isImpermeableSoil,
  isPermeableSurfaceWithoutPermanentVegetation,
  isPrairie,
  isSurfaceWithEcosystemBenefits,
  isSurfaceWithPermanentVegetation,
  isWetLand,
  SoilType,
  sumListWithKey,
} from "shared";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";

import ModalFeature from "./ModalFeature";
import ModalFeatureLine from "./ModalFeatureLine";

const getSoilsDistributionFilterFunction = (
  subset?: ModalSoilsDistributionProps["soilsSubset"],
): ((item: SoilType) => boolean) => {
  switch (subset) {
    case "artificialTree":
      return (soilType) => soilType === "ARTIFICIAL_TREE_FILLED";
    case "artificialGrass":
      return (soilType) => soilType === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED";
    case "hasEcosystemBenefits":
      return isSurfaceWithEcosystemBenefits;

    case "forest":
      return isForest;

    case "prairie":
      return isPrairie;

    case "wetLand":
      return isWetLand;

    case "permanentVegetation":
      return isSurfaceWithPermanentVegetation;

    case "permeableWithoutPermanentVegetation":
      return isPermeableSurfaceWithoutPermanentVegetation;

    case "buildings":
      return (soilType) => soilType === "BUILDINGS";
    case "impermeable":
      return isImpermeableSoil;
    default:
      return () => true;
  }
};

export type ModalSoilsDistributionProps = {
  soilsSubset?:
    | "artificialTree"
    | "artificialGrass"
    | "hasEcosystemBenefits"
    | "forest"
    | "prairie"
    | "wetLand"
    | "permanentVegetation"
    | "permeableWithoutPermanentVegetation"
    | "impermeable"
    | "buildings";
  label: string;
  soilsDistribution: {
    total: number;
    soilType: SoilType;
  }[];
};

const ModalSoilsDistribution = ({
  label,
  soilsSubset,
  soilsDistribution,
}: ModalSoilsDistributionProps) => {
  const list = soilsDistribution.filter((item) =>
    getSoilsDistributionFilterFunction(soilsSubset)(item.soilType),
  );

  const total = sumListWithKey(list, "total");

  return (
    <ModalFeature>
      <ModalFeatureLine isTotal label={label} value={`${formatNumberFr(total)} m²`} />
      {list.map((item) => (
        <ModalFeatureLine
          key={item.soilType}
          label={getLabelForSoilType(item.soilType)}
          value={`${formatNumberFr(item.total)} m²`}
        />
      ))}
    </ModalFeature>
  );
};

export default ModalSoilsDistribution;
