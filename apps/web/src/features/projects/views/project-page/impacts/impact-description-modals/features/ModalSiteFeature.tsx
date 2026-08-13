import { useMemo } from "react";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import ModalFeature from "./ModalFeature";
import ModalFeatureLine from "./ModalFeatureLine";
import ModalSoilsDistribution, { ModalSoilsDistributionProps } from "./ModalSoilsDistribution";

type Props = {
  label: string;
  value: "siteAddress" | "contaminatedSurfaceArea" | "siteSurfaceArea" | "soilsDistribution";
  soilsSubset?: ModalSoilsDistributionProps["soilsSubset"];
  soilsDistribution: ModalSoilsDistributionProps["soilsDistribution"];
  siteSurfaceArea: number;
  contaminatedSurfaceArea?: number;
  siteAddress: string;
};

const ModalSiteFeature = ({
  value,
  soilsSubset,
  label,
  siteSurfaceArea,
  soilsDistribution,
  contaminatedSurfaceArea,
  siteAddress,
}: Props) => {
  const total = useMemo(() => {
    switch (value) {
      case "contaminatedSurfaceArea":
        return contaminatedSurfaceArea;

      case "siteSurfaceArea":
        return siteSurfaceArea;
    }
  }, [value, contaminatedSurfaceArea, siteSurfaceArea]);

  if (value === "siteAddress") {
    return (
      <ModalFeature>
        <ModalFeatureLine label={label} value={siteAddress} />
      </ModalFeature>
    );
  }

  if (value === "soilsDistribution") {
    return (
      <ModalSoilsDistribution
        label={label}
        soilsDistribution={soilsDistribution}
        soilsSubset={soilsSubset}
      />
    );
  }
  if (!total) {
    return null;
  }

  return (
    <ModalFeature>
      <ModalFeatureLine label={label} value={`${formatNumberFr(total)} m²`} />
    </ModalFeature>
  );
};

export default ModalSiteFeature;
