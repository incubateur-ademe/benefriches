import { useMemo } from "react";
import { BuildingsUseDistribution } from "shared";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import ModalFeature from "./ModalFeature";
import ModalFeatureLine from "./ModalFeatureLine";
import ModalSoilsDistribution, { ModalSoilsDistributionProps } from "./ModalSoilsDistribution";

type Props = {
  value:
    | "soilsDistribution"
    | "contaminatedSurfaceArea"
    | "photovoltaicSurfaceArea"
    | "electricalPowerKwc"
    | "newNatureSoilsSurface"
    | "residentialBuildingsFloorArea"
    | "publicFacilitiesBuildingsFloorArea"
    | "officesBuildingsFloorArea";

  soilsSubset?: ModalSoilsDistributionProps["soilsSubset"];
  soilsDistribution: ModalSoilsDistributionProps["soilsDistribution"];
  label: string;

  decontaminatedSurfaceArea?: number;
  siteContaminatedSurfaceArea?: number;
  projectDevelopmentPlan:
    | {
        type: "PHOTOVOLTAIC_POWER_PLANT";
        installationElectricalPowerKWc: number;
        installationSurfaceArea: number;
      }
    | {
        type: "URBAN_PROJECT";
        buildingsFloorAreaDistribution: BuildingsUseDistribution;
      };
};

const ModalProjectFeature = ({
  value,
  label,
  soilsSubset,
  soilsDistribution,
  projectDevelopmentPlan,
  decontaminatedSurfaceArea,
  siteContaminatedSurfaceArea,
}: Props) => {
  const total = useMemo(() => {
    switch (value) {
      case "contaminatedSurfaceArea":
        return siteContaminatedSurfaceArea && decontaminatedSurfaceArea
          ? siteContaminatedSurfaceArea - decontaminatedSurfaceArea
          : undefined;
      case "photovoltaicSurfaceArea":
        return projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
          ? projectDevelopmentPlan.installationSurfaceArea
          : undefined;
      case "electricalPowerKwc":
        return projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
          ? projectDevelopmentPlan.installationElectricalPowerKWc
          : undefined;

      case "publicFacilitiesBuildingsFloorArea":
        return projectDevelopmentPlan.type === "URBAN_PROJECT"
          ? projectDevelopmentPlan.buildingsFloorAreaDistribution.PUBLIC_FACILITIES
          : undefined;
      case "officesBuildingsFloorArea":
        return projectDevelopmentPlan.type === "URBAN_PROJECT"
          ? projectDevelopmentPlan.buildingsFloorAreaDistribution.OFFICES
          : undefined;
      case "residentialBuildingsFloorArea":
        return projectDevelopmentPlan.type === "URBAN_PROJECT"
          ? projectDevelopmentPlan.buildingsFloorAreaDistribution.RESIDENTIAL
          : undefined;
    }
  }, [projectDevelopmentPlan, siteContaminatedSurfaceArea, decontaminatedSurfaceArea, value]);

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
      <ModalFeatureLine
        label={label}
        value={`${formatNumberFr(total)} ${value === "electricalPowerKwc" ? "Kwc" : "m²"}`}
      />
    </ModalFeature>
  );
};

export default ModalProjectFeature;
