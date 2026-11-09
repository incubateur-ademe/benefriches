import { useMemo } from "react";

import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

import { formatSurfaceAreaPdf } from "../../pdf-impacts-export/pdf-export/format";
import ModalFeature from "./ModalFeature";
import ModalFeatureLine from "./ModalFeatureLine";
import ModalFeaturePdf from "./ModalFeaturePdf";
import ModalFeaturePdfLine from "./ModalFeaturePdfLine";
import type { ModalSoilsDistributionProps } from "./ModalSoilsDistribution";
import ModalSoilsDistribution from "./ModalSoilsDistribution";

type Props = {
  label: string;
  value: "siteAddress" | "contaminatedSurfaceArea" | "siteSurfaceArea" | "soilsDistribution";
  soilsSubset?: ModalSoilsDistributionProps["soilsSubset"];
  soilsDistribution: ModalSoilsDistributionProps["soilsDistribution"];
  siteSurfaceArea: number;
  contaminatedSurfaceArea?: number;
  siteAddress: string;
  isPdf?: boolean;
};

const ModalSiteFeature = ({
  value,
  soilsSubset,
  label,
  siteSurfaceArea,
  soilsDistribution,
  contaminatedSurfaceArea,
  siteAddress,
  isPdf = false,
}: Props) => {
  const formatFn = isPdf ? formatSurfaceAreaPdf : formatSurfaceArea;
  const formattedValue = useMemo(() => {
    switch (value) {
      case "contaminatedSurfaceArea":
        return formatFn(contaminatedSurfaceArea ?? 0);

      case "siteSurfaceArea":
        return formatFn(siteSurfaceArea);
      case "siteAddress":
        return siteAddress;
    }
  }, [value, contaminatedSurfaceArea, siteSurfaceArea, siteAddress, formatFn]);

  if (value === "soilsDistribution") {
    return (
      <ModalSoilsDistribution
        isPdf={isPdf}
        label={label}
        soilsDistribution={soilsDistribution}
        soilsSubset={soilsSubset}
      />
    );
  }
  if (!formattedValue) {
    return null;
  }

  if (isPdf) {
    return (
      <ModalFeaturePdf>
        <ModalFeaturePdfLine label={label} value={formattedValue} />
      </ModalFeaturePdf>
    );
  }

  return (
    <ModalFeature>
      <ModalFeatureLine label={label} value={formattedValue} />
    </ModalFeature>
  );
};

export default ModalSiteFeature;
