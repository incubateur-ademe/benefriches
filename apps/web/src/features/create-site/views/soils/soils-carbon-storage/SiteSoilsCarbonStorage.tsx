import { useEffect } from "react";
import Button from "@codegouvfr/react-dsfr/Button";

import { SiteSoilsCarbonStorageResult } from "@/features/create-site/application/siteSoilsCarbonStorage.actions";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import SoilsCarbonStorageChart from "@/shared/views/components/Charts/SoilsCarbonStorageChart";

type Props = {
  onNext: () => void;
  loading: boolean;
  siteCarbonStorage?: SiteSoilsCarbonStorageResult;
  fetchSiteCarbonStorage: () => void;
};

const SiteSoilsCarbonStorage = ({
  onNext,
  loading,
  siteCarbonStorage,
  fetchSiteCarbonStorage,
}: Props) => {
  useEffect(() => {
    fetchSiteCarbonStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2>Stockage du carbone par les sols</h2>
      {loading && <p>Calcul du stockage de carbone du site...</p>}
      {siteCarbonStorage && (
        <>
          <p>
            Ce site stocke environ{" "}
            <strong>
              {formatNumberFr(siteCarbonStorage.totalCarbonStorage)} t
            </strong>{" "}
            de carbone.
          </p>
          <SoilsCarbonStorageChart
            soilsCarbonStorage={siteCarbonStorage.soilsStorage}
          />
        </>
      )}
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default SiteSoilsCarbonStorage;
