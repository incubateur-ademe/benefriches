import { Alert } from "@codegouvfr/react-dsfr/Alert";

import { SoilsCarbonStorageResult } from "@/features/create-project/core/soilsCarbonStorage.action";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SoilsCarbonStorageComparison from "./SoilsCarbonStorageComparison";

type DataProps =
  | {
      loadingState: "loading" | "error" | "idle";
      currentCarbonStorage: undefined;
      projectedCarbonStorage: undefined;
    }
  | {
      loadingState: "success";
      currentCarbonStorage: SoilsCarbonStorageResult;
      projectedCarbonStorage: SoilsCarbonStorageResult;
    };

type Props = {
  onBack: () => void;
  onNext: () => void;
} & DataProps;

export default function SoilsCarbonStorageComparisonWrapper({
  loadingState,
  onBack,
  onNext,
  currentCarbonStorage,
  projectedCarbonStorage,
}: Props) {
  switch (loadingState) {
    case "loading":
      return (
        <>
          <h2>Stockage du carbone par les sols</h2>
          <LoadingSpinner loadingText="Calcul du pouvoir de stockage de carbone par les sols..." />
        </>
      );
    case "error":
      return (
        <WizardFormLayout title="Stockage du carbone par les sols">
          <Alert
            description="Une erreur s'est produite lors du calcul du pouvoir de stockage de carbone par les sols..."
            severity="error"
            title="Erreur"
            className="tw-my-7"
          />
          <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
        </WizardFormLayout>
      );
    case "success":
      return (
        <SoilsCarbonStorageComparison
          currentCarbonStorage={currentCarbonStorage}
          projectedCarbonStorage={projectedCarbonStorage}
          onNext={onNext}
          onBack={onBack}
        />
      );
    default:
      return null;
  }
}
