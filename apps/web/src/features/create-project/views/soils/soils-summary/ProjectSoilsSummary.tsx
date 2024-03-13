import { SoilType } from "@/shared/domain/soils";
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
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-6">
          <h3>Site existant</h3>
          <SurfaceAreaPieChart soilsDistribution={siteSoilsDistribution} />
        </div>
        <div className="fr-col-6">
          <h3>Site avec projet</h3>
          <SurfaceAreaPieChart soilsDistribution={projectSoilsDistribution} />
        </div>
      </div>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default SiteSoilsSummary;
