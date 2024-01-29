import { useEffect } from "react";
import Button from "@codegouvfr/react-dsfr/Button";

import { SiteCarbonStorage } from "@/features/create-site/application/siteSoilsCarbonStorage.reducer";
import { getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/domain/carbonEmissions";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import SoilsCarbonStorageChart from "@/shared/views/components/Charts/SoilsCarbonStorageChart";

type Props = {
  onNext: () => void;
  loading: boolean;
  siteCarbonStorage?: SiteCarbonStorage;
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
            Ce site stocke environ <strong>{formatNumberFr(siteCarbonStorage.total)} t</strong> de
            carbone.
          </p>
          <p>
            C'est l'équivalent de ce qu'émettent{" "}
            <strong>
              {formatNumberFr(
                Math.round(
                  getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson(siteCarbonStorage.total),
                ),
              )}{" "}
              français
            </strong>{" "}
            en 1 an.
          </p>
          <SoilsCarbonStorageChart soilsCarbonStorage={siteCarbonStorage.soils} />
        </>
      )}
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default SiteSoilsCarbonStorage;
