import { useEffect } from "react";
import Button from "@codegouvfr/react-dsfr/Button";

import { SiteSoilsCarbonStorageResult } from "@/features/create-site/application/siteSoilsCarbonStorage.actions";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  onNext: () => void;
  loading: boolean;
  carbonStorage?: SiteSoilsCarbonStorageResult;
  loadSiteCarbonStorage: () => void;
};

const SiteSoilsCarbonStorage = ({
  onNext,
  loading,
  carbonStorage,
  loadSiteCarbonStorage,
}: Props) => {
  useEffect(() => {
    loadSiteCarbonStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2>Stockage du carbone par les sols</h2>
      {loading && <p>Calcul du stockage de carbone du site...</p>}
      {carbonStorage && (
        <p>
          Ce site stocke environ{" "}
          <strong>{formatNumberFr(carbonStorage.totalCarbonStorage)} t</strong>{" "}
          de carbone.
        </p>
      )}
      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default SiteSoilsCarbonStorage;
