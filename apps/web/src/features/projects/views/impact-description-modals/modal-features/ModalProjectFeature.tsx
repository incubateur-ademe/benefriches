import { useMemo } from "react";
import type { BuildingsUseDistribution } from "shared";

import { formatNumberFr, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

import { formatSurfaceAreaPdf } from "../../pdf-impacts-export/pdf-export/format";
import ModalFeature from "./ModalFeature";
import ModalFeatureLine from "./ModalFeatureLine";
import ModalFeaturePdf from "./ModalFeaturePdf";
import ModalFeaturePdfLine from "./ModalFeaturePdfLine";
import type { ModalSoilsDistributionProps } from "./ModalSoilsDistribution";
import ModalSoilsDistribution from "./ModalSoilsDistribution";

type Props = {
  value:
    | "soilsDistribution"
    | "contaminatedSurfaceArea"
    | "photovoltaicSurfaceArea"
    | "electricalPowerKwc"
    | "newNatureSoilsSurface"
    | "residentialBuildingsFloorArea"
    | "publicFacilitiesBuildingsFloorArea"
    | "officesBuildingsFloorArea"
    | "groundFloorRetailSurface";

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
  isPdf?: boolean;
};

const getSiteFeatureValue = ({
  value,
  isPdf,
  projectDevelopmentPlan,
  decontaminatedSurfaceArea,
  siteContaminatedSurfaceArea,
}: Props) => {
  const formatSurfaceFn = isPdf ? formatSurfaceAreaPdf : formatSurfaceArea;

  switch (value) {
    case "contaminatedSurfaceArea":
      return siteContaminatedSurfaceArea && decontaminatedSurfaceArea
        ? formatSurfaceFn(siteContaminatedSurfaceArea - decontaminatedSurfaceArea)
        : undefined;

    case "photovoltaicSurfaceArea":
      return projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
        ? formatSurfaceFn(projectDevelopmentPlan.installationSurfaceArea)
        : undefined;

    case "electricalPowerKwc":
      return projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
        ? `${formatNumberFr(projectDevelopmentPlan.installationElectricalPowerKWc)} Kwc}`
        : undefined;

    case "publicFacilitiesBuildingsFloorArea":
      return projectDevelopmentPlan.type === "URBAN_PROJECT"
        ? formatSurfaceFn(
            projectDevelopmentPlan.buildingsFloorAreaDistribution.PUBLIC_FACILITIES ?? 0,
          )
        : undefined;

    case "officesBuildingsFloorArea":
      return projectDevelopmentPlan.type === "URBAN_PROJECT"
        ? formatSurfaceFn(projectDevelopmentPlan.buildingsFloorAreaDistribution.OFFICES ?? 0)
        : undefined;

    case "residentialBuildingsFloorArea":
      return projectDevelopmentPlan.type === "URBAN_PROJECT"
        ? formatSurfaceFn(projectDevelopmentPlan.buildingsFloorAreaDistribution.RESIDENTIAL ?? 0)
        : undefined;

    case "groundFloorRetailSurface":
      return projectDevelopmentPlan.type === "URBAN_PROJECT"
        ? formatSurfaceFn(projectDevelopmentPlan.buildingsFloorAreaDistribution.LOCAL_STORE ?? 0)
        : undefined;
  }
};

const ModalProjectFeature = (props: Props) => {
  const formattedValue = useMemo(() => getSiteFeatureValue(props), [props]);

  if (props.value === "soilsDistribution") {
    return (
      <ModalSoilsDistribution
        label={props.label}
        soilsDistribution={props.soilsDistribution}
        soilsSubset={props.soilsSubset}
        isPdf={props.isPdf ?? false}
      />
    );
  }
  if (!formattedValue) {
    return null;
  }

  if (props.isPdf) {
    return (
      <ModalFeaturePdf>
        <ModalFeaturePdfLine label={props.label} value={formattedValue} />
      </ModalFeaturePdf>
    );
  }

  return (
    <ModalFeature>
      <ModalFeatureLine label={props.label} value={formattedValue} />
    </ModalFeature>
  );
};

export default ModalProjectFeature;
