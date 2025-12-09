import { useEffect } from "react";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";
import SoilsCarbonStorageComparison from "@/shared/views/project-form/common/soils-carbon-storage-comparison/SoilsCarbonStorageComparison";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

export default function UrbanProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();

  const {
    onBack,
    onNext,
    selectSoilsCarbonStorageDifference,
    onFetchSoilsCarbonStorageDifference,
  } = useProjectForm();

  const { current, projected, loadingState } = useAppSelector(selectSoilsCarbonStorageDifference);

  useEffect(() => {
    onFetchSoilsCarbonStorageDifference();
  }, [dispatch, onFetchSoilsCarbonStorageDifference]);

  if (loadingState === "error") {
    return (
      <WizardFormLayout title="Stockage du carbone par les sols après aménagement">
        <section className="bg-warning-ultralight dark:bg-warning-ultradark p-6 rounded-lg mb-4">
          <span
            aria-hidden="true"
            className="fr-icon--lg fr-icon-error-warning-line before:dark:text-warning-ultralight before:text-warning-ultradark flex mb-4"
          ></span>
          <p className="text-xl font-black">Bénéfriches n'a pas pu effectuer le calcul...</p>
          Des données nécessaires au calcul de stockage du carbone sont manquantes&nbsp;:
          <ol>
            <li>Veuillez remplir la répartition des espaces si ce n'est pas fait.</li>
            <li>
              Bénéfriches n'a pas les données nécessaires pour calculer le stockage du carbone sur
              des terrains hors France Métropolitaine
            </li>
          </ol>
        </section>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </WizardFormLayout>
    );
  }

  if (loadingState === "loading") {
    return (
      <>
        <h2>Stockage du carbone par les sols après aménagement</h2>
        <LoadingSpinner />
      </>
    );
  }

  if (loadingState === "success") {
    return (
      <SoilsCarbonStorageComparison
        onNext={onNext}
        onBack={onBack}
        currentCarbonStorage={current!}
        projectedCarbonStorage={projected!}
      />
    );
  }
}
