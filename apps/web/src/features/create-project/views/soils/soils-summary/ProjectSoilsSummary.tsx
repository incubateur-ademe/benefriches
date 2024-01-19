import Button from "@codegouvfr/react-dsfr/Button";

import { SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import SurfaceArea from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  onNext: () => void;
  totalSurfaceArea: number;
  siteSoilsDistribution: Partial<Record<SoilType, number>>;
  projectSoilsDistribution: Partial<Record<SoilType, number>>;
};

const SiteSoilsSummary = ({
  totalSurfaceArea,
  onNext,
  siteSoilsDistribution,
  projectSoilsDistribution,
}: Props) => {
  const formattedTotalSurfaceAreaInHectare = formatNumberFr(
    convertSquareMetersToHectares(totalSurfaceArea),
  );

  return (
    <>
      <h2>Répartition finale des sols du site à l’issue du projet</h2>
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
          <h3>Avant</h3>
          <SurfaceAreaPieChart soilsDistribution={siteSoilsDistribution} />
        </div>
        <div className="fr-col-6">
          <h3>Après</h3>
          <SurfaceAreaPieChart soilsDistribution={projectSoilsDistribution} />
        </div>
      </div>

      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default SiteSoilsSummary;
