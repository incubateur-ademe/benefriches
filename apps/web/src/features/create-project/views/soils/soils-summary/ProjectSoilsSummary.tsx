import Button from "@codegouvfr/react-dsfr/Button";

import { SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import SurfaceArea from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  onNext: () => void;
  totalSurfaceArea: number;
  siteSoilsSurfaceAreas: Partial<Record<SoilType, number>>;
  projectSoilsSurfaceAreas: Partial<Record<SoilType, number>>;
};

const SiteSoilsSummary = ({
  totalSurfaceArea,
  onNext,
  siteSoilsSurfaceAreas,
  projectSoilsSurfaceAreas,
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
          <SurfaceAreaPieChart soilsSurfaceAreas={siteSoilsSurfaceAreas} />
        </div>
        <div className="fr-col-6">
          <h3>Après</h3>
          <SurfaceAreaPieChart soilsSurfaceAreas={projectSoilsSurfaceAreas} />
        </div>
      </div>

      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default SiteSoilsSummary;
