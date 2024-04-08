import { useEffect } from "react";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import CarbonStorageDifferenceSection from "./CarbonStorageDifferenceSection";
import { formatCarbonStorage } from "./formatCarbonStorage";

import { State } from "@/features/create-project/application/soilsCarbonStorage.reducer";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SoilsCarbonStorageChart from "@/shared/views/components/Charts/SoilsCarbonStorageChart";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

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
      <WizardFormLayout title="Stockage du carbone par les sols">
        <Alert
          description="Une erreur s’est produite lors du calcul du pouvoir de stockage de carbone par les sols..."
          severity="error"
          title="Erreur"
          className="fr-my-7v"
        />
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </WizardFormLayout>
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
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-6">
            <h3>
              Site existant : {formatCarbonStorage(currentCarbonStorage.totalCarbonStorage)} tonnes
              de CO2-eq stockées
            </h3>
            <SoilsCarbonStorageChart soilsCarbonStorage={currentCarbonStorage.soilsStorage} />
          </div>

          <div className="fr-col-6">
            <h3>
              Site avec projet : {formatCarbonStorage(projectedCarbonStorage.totalCarbonStorage)}{" "}
              tonnes de CO2-eq stockées
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
