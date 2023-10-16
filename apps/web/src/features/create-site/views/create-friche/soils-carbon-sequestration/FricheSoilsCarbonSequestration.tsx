import { useEffect } from "react";
import Chart from "react-apexcharts";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { getLabelForFricheSoilType } from "../soilTypeLabelMapping";

import { SiteSoilsCarbonSequestrationResult } from "@/features/create-site/application/siteSoilsCarbonSequestration.actions";
import { FricheSoilType } from "@/features/create-site/domain/friche.types";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  onNext: () => void;
  loading: boolean;
  carbonSequestration?: SiteSoilsCarbonSequestrationResult;
  loadSiteCarbonSequestration: () => void;
};

const FricheSoilsCarbonSequestration = ({
  onNext,
  loading,
  carbonSequestration,
  loadSiteCarbonSequestration,
}: Props) => {
  useEffect(() => {
    loadSiteCarbonSequestration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const series =
    carbonSequestration && Object.values(carbonSequestration.soilsStorage);
  const labels =
    carbonSequestration &&
    Object.keys(carbonSequestration.soilsStorage).map((soilType) =>
      getLabelForFricheSoilType(soilType as FricheSoilType),
    );

  return (
    <>
      <h2>Stockage du carbone par les sols</h2>
      {loading && <p>Calcul du stockage de carbone du site...</p>}
      {carbonSequestration && (
        <>
          <p>
            Ce site stocke environ{" "}
            <strong>
              {formatNumberFr(carbonSequestration.totalCarbonStorage)} t
            </strong>{" "}
            de carbone.
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
      )}
    </>
  );
};

export default FricheSoilsCarbonSequestration;
