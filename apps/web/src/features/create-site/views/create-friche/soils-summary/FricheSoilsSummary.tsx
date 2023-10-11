import Chart from "react-apexcharts";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { getLabelForFricheSoilType } from "../soilTypeLabelMapping";

import { FricheSoilType } from "@/features/create-site/domain/friche.types";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";

type Props = {
  onNext: () => void;
  totalSurfaceArea: number;
  soilsSurfaceAreas: Partial<Record<FricheSoilType, number>>;
};

const FricheSoilsSummary = ({
  totalSurfaceArea,
  onNext,
  soilsSurfaceAreas,
}: Props) => {
  const formattedTotalSurfaceArea = formatNumberFr(totalSurfaceArea);
  const formattedTotalSurfaceAreaInHectare = formatNumberFr(
    convertSquareMetersToHectares(totalSurfaceArea),
  );

  const series = Object.values(soilsSurfaceAreas);
  const labels = Object.keys(soilsSurfaceAreas).map((soilType) =>
    getLabelForFricheSoilType(soilType as FricheSoilType),
  );

  return (
    <>
      <h2>Récapitulatif des sols du site</h2>
      <p>
        Superficie totale de la friche : {formattedTotalSurfaceArea} m2, soit{" "}
        {formattedTotalSurfaceAreaInHectare} ha.
      </p>
      <div className={fr.cx("fr-container", "fr-py-4w")}>
        <Chart
          type="pie"
          width="800"
          series={series}
          options={{ labels, chart: { fontFamily: "" } }}
        />
      </div>
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default FricheSoilsSummary;
