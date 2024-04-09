import { useEffect } from "react";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import CarbonStorageDifferenceSection from "./CarbonStorageDifferenceSection";
import { formatCarbonStorage } from "./formatCarbonStorage";

import { State } from "@/features/create-project/application/soilsCarbonStorage.reducer";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getPercentageDifference } from "@/shared/services/percentage/percentage";
import { roundToInteger } from "@/shared/services/round-numbers/roundNumbers";
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

const getPercentageDifferenceFormated = (current: number, projected: number) => {
  const percentage = getPercentageDifference(current, projected);
  const roundedValue = roundToInteger(percentage);

  return `${roundedValue > 0 ? "+" : ""}${formatNumberFr(roundedValue)}%`;
};

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
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6 tw-pb-10">
          <div className="tw-border tw-border-solid tw-border-gray tw-p-8">
            <h3 className="tw-uppercase tw-text-base">Site existant :</h3>
            <p>
              {formatCarbonStorage(currentCarbonStorage.totalCarbonStorage)} t de carbone stockés
            </p>
            <SoilsCarbonStorageChart soilsCarbonStorage={currentCarbonStorage.soilsStorage} />
          </div>

          <div className="tw-border tw-border-solid tw-border-gray tw-p-8">
            <h3 className="tw-uppercase tw-text-base">Site avec projet :</h3>
            <p>
              {formatCarbonStorage(projectedCarbonStorage.totalCarbonStorage)} t de carbone stockés
              (
              {getPercentageDifferenceFormated(
                currentCarbonStorage.totalCarbonStorage,
                projectedCarbonStorage.totalCarbonStorage,
              )}
              )
            </p>
            <SoilsCarbonStorageChart soilsCarbonStorage={projectedCarbonStorage.soilsStorage} />
          </div>
        </div>

        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </>
    );
  }
};

export default ProjectSoilsCarbonStorage;
