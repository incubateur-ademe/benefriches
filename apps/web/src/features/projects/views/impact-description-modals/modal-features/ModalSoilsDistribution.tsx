import type { SoilType } from "shared";
import {
  formatSurfaceArea,
  isForest,
  isImpermeableSoil,
  isPermeableSurfaceWithoutPermanentVegetation,
  isPrairie,
  isSurfaceWithEcosystemBenefits,
  isSurfaceWithPermanentVegetation,
  isWetLand,
  sumListWithKey,
} from "shared";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";

import { formatSurfaceAreaPdf } from "../../pdf-impacts-export/pdf-export/format";
import ModalFeature from "./ModalFeature";
import ModalFeatureLine from "./ModalFeatureLine";
import ModalFeaturePdf from "./ModalFeaturePdf";
import ModalFeaturePdfLine from "./ModalFeaturePdfLine";

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
  isPdf: boolean;
};

const ModalSoilsDistribution = ({
  label,
  soilsSubset,
  soilsDistribution,
  isPdf,
}: ModalSoilsDistributionProps) => {
  const list = soilsDistribution.filter((item) =>
    getSoilsDistributionFilterFunction(soilsSubset)(item.soilType),
  );

  const total = sumListWithKey(list, "total");

  if (isPdf) {
    return (
      <ModalFeaturePdf>
        <ModalFeaturePdfLine
          isTotal
          label={label}
          value={formatSurfaceAreaPdf(total)}
          style={{ paddingTop: 8 }}
        />
        {list.map((item, index) => (
          <ModalFeaturePdfLine
            key={item.soilType}
            label={getLabelForSoilType(item.soilType)}
            value={formatSurfaceAreaPdf(item.total)}
            style={index === list.length - 1 ? { paddingBottom: 8 } : undefined}
          />
        ))}
      </ModalFeaturePdf>
    );
  }

  return (
    <ModalFeature>
      <ModalFeatureLine isTotal label={label} value={`${formatNumberFr(total)} m²`} />
      {list.map((item) => (
        <ModalFeatureLine
          key={item.soilType}
          label={getLabelForSoilType(item.soilType)}
          value={formatSurfaceArea(item.total)}
        />
      ))}
    </ModalFeature>
  );
};

export default ModalSoilsDistribution;
