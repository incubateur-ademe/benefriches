import Button from "@codegouvfr/react-dsfr/Button";
import SurfaceAreaPieChart from "./SurfaceAreaPieChart";

import { SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";

type Props = {
  onNext: () => void;
  totalSurfaceArea: number;
  soilsSurfaceAreas: Partial<Record<SoilType, number>>;
};

const SiteSoilsSummary = ({
  totalSurfaceArea,
  onNext,
  soilsSurfaceAreas,
}: Props) => {
  const formattedTotalSurfaceArea = formatNumberFr(totalSurfaceArea);
  const formattedTotalSurfaceAreaInHectare = formatNumberFr(
    convertSquareMetersToHectares(totalSurfaceArea),
  );

  return (
    <>
      <h2>Récapitulatif des sols du site</h2>
      <p>
        Superficie totale du site :{" "}
        <strong>
          {formattedTotalSurfaceArea} m2, soit{" "}
          {formattedTotalSurfaceAreaInHectare} ha
        </strong>
        .
      </p>
      <SurfaceAreaPieChart soilsSurfaceAreas={soilsSurfaceAreas} />
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default SiteSoilsSummary;
