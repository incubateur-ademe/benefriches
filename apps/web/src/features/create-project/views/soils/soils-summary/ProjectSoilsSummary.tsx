import { SoilType } from "shared";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import SurfaceArea from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  onNext: () => void;
  onBack: () => void;
  totalSurfaceArea: number;
  siteSoilsDistribution: Partial<Record<SoilType, number>>;
  projectSoilsDistribution: Partial<Record<SoilType, number>>;
};

const SiteSoilsSummary = ({
  totalSurfaceArea,
  onNext,
  onBack,
  siteSoilsDistribution,
  projectSoilsDistribution,
}: Props) => {
  const formattedTotalSurfaceAreaInHectare = formatNumberFr(
    convertSquareMetersToHectares(totalSurfaceArea),
  );

  return (
    <>
      <h2>Récapitulatif de la typologie des sols</h2>
      <p>
        Superficie totale du site :{" "}
        <strong>
          <SurfaceArea surfaceAreaInSquareMeters={totalSurfaceArea} />, soit{" "}
          {formattedTotalSurfaceAreaInHectare} ha
        </strong>
        .
      </p>
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6 tw-pb-10">
        <div className="tw-border tw-border-solid tw-border-grey tw-p-8">
          <h3 className="tw-uppercase tw-text-base">Site existant</h3>
          <SurfaceAreaPieChart soilsDistribution={siteSoilsDistribution} />
        </div>
        <div className="tw-border tw-border-solid tw-border-grey tw-p-8">
          <h3 className="tw-uppercase tw-text-base">Site avec projet</h3>
          <SurfaceAreaPieChart soilsDistribution={projectSoilsDistribution} />
        </div>
      </div>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default SiteSoilsSummary;
