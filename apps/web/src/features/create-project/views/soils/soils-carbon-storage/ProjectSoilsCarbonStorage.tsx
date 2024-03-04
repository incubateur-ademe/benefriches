import { useEffect } from "react";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import CarbonStorageDifferenceSection from "./CarbonStorageDifferenceSection";

import { State } from "@/features/create-project/application/soilsCarbonStorage.reducer";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SoilsCarbonStorageChart from "@/shared/views/components/Charts/SoilsCarbonStorageChart";

type PropsFunction = {
  onNext: () => void;
  onBack: () => void;
  fetchSoilsCarbonStorage: () => void;
};

type SuccessData = {
  loadingState: Exclude<State["loadingState"], "idle" | "error" | "loading">;
  currentCarbonStorage: Exclude<State["current"], undefined>;
  projectedCarbonStorage: Exclude<State["projected"], undefined>;
};

type LoadingOrErrorData = {
  loadingState: Exclude<State["loadingState"], "success">;
  currentCarbonStorage: undefined;
  projectedCarbonStorage: undefined;
};

type PropsData = SuccessData | LoadingOrErrorData;
type Props = PropsFunction & PropsData;

const ProjectSoilsCarbonStorage = ({
  onNext,
  onBack,
  fetchSoilsCarbonStorage,
  loadingState,
  currentCarbonStorage,
  projectedCarbonStorage,
}: Props) => {
  useEffect(() => {
    fetchSoilsCarbonStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingState === "loading") {
    return <p>Calcul du pouvoir de stockage de carbone par les sols...</p>;
  }

  if (loadingState === "error") {
    return (
      <>
        <h2>Stockage du carbone par les sols</h2>

        <Alert
          description="Une erreur s’est produite lors du calcul du pouvoir de stockage de carbone par les sols..."
          severity="error"
          title="Erreur"
          className="fr-my-7v"
        />
        <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
          Suivant
        </Button>
      </>
    );
  }

  if (loadingState === "success") {
    return (
      <>
        <h2>Stockage du carbone par les sols</h2>
        <CarbonStorageDifferenceSection
          carbonStorageDifference={
            projectedCarbonStorage.totalCarbonStorage - currentCarbonStorage.totalCarbonStorage
          }
        />
        <p></p>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-6">
            <h3>
              Avant : {formatNumberFr(currentCarbonStorage.totalCarbonStorage)} tonnes de CO2-eq
              stockées
            </h3>
            <SoilsCarbonStorageChart soilsCarbonStorage={currentCarbonStorage.soilsStorage} />
          </div>

          <div className="fr-col-6">
            <h3>
              Après : {formatNumberFr(projectedCarbonStorage.totalCarbonStorage)} tonnes de CO2-eq
              stockées
            </h3>
            <SoilsCarbonStorageChart soilsCarbonStorage={projectedCarbonStorage.soilsStorage} />
          </div>
        </div>

        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </>
    );
  }
};

export default ProjectSoilsCarbonStorage;
