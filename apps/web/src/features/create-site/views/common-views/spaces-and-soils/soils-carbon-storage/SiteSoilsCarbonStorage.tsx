import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";

import { SiteCarbonStorage } from "@/features/create-site/core/siteSoilsCarbonStorage.reducer";
import { getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/core/carbonEmissions";
import { formatCarbonStorage } from "@/shared/core/format-number/formatCarbonStorage";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SoilsCarbonStorageChart from "@/shared/views/components/Charts/SoilsCarbonStorageChart";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
  loadingState: "idle" | "loading" | "success" | "error";
  siteCarbonStorage?: SiteCarbonStorage;
  fetchSiteCarbonStorage: () => void;
};

const SiteSoilsCarbonStorage = ({
  onNext,
  onBack,
  loadingState,
  siteCarbonStorage,
  fetchSiteCarbonStorage,
}: Props) => {
  useEffect(() => {
    fetchSiteCarbonStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalText = siteCarbonStorage ? formatCarbonStorage(siteCarbonStorage.total) : "";

  const frenchAnnualEmissionsText = siteCarbonStorage
    ? formatNumberFr(
        Math.round(getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson(siteCarbonStorage.total)),
      )
    : "";

  return (
    <WizardFormLayout
      title="Stockage du carbone par les sols"
      instructions={
        <FormInfo emoji="auto">
          <span className="title">
            Comment est calculé le stockage du carbone des sols de mon site&nbsp;?
          </span>
          <p>
            Les calculs sont réalisés à partir des données de référence, exprimées en tonne
            d'équivalent carbone par hectare de sol sur une durée de 50 ans, de l’outil ALDO
            développé par l’ADEME. Dans un souci de simplification, seules les valeurs de stocks
            sont utilisées (on ne considère pas les flux).
          </p>
          Sources&nbsp;:
          <ul>
            <li>
              Stocks de carbone&nbsp;:{" "}
              <ExternalLink
                title="Documentation d'ALDO - ouvre une nouvelle fenêtre"
                href="https://aldo-carbone.ademe.fr/"
              >
                outil ALDO
              </ExternalLink>
            </li>
            <li>
              Notions de stock, flux et paramètre d'influence&nbsp;:{" "}
              <ExternalLink href="https://docs.datagir.ademe.fr/documentation-aldo/introduction/definitions">
                Définitions ALDO
              </ExternalLink>
            </li>
          </ul>
        </FormInfo>
      }
    >
      {loadingState === "loading" && (
        <LoadingSpinner loadingText="Calcul du stockage de carbone du site..." />
      )}
      {loadingState === "error" && (
        <Alert
          description="Une erreur s'est produite lors du calcul du pouvoir de stockage de carbone par les sols..."
          severity="error"
          title="Erreur"
          className="my-7"
        />
      )}
      {siteCarbonStorage && (
        <>
          <p>
            Ce site stocke environ <strong>{totalText} t</strong> de carbone.
          </p>
          <p>
            C'est l'équivalent de ce qu'émettent{" "}
            <strong>{frenchAnnualEmissionsText} français</strong> en 1 an.
          </p>
          <div className="mb-10">
            <SoilsCarbonStorageChart
              soilsCarbonStorage={siteCarbonStorage.soils}
              exportConfig={{
                title: "Stockage du carbone par les sols",
                caption: `Ce site stocke environ <strong>${totalText} t</strong> de carbone.<br>C'est l'équivalent de ce qu'émettent <strong>${frenchAnnualEmissionsText} français</strong> en 1 an.`,
              }}
            />
          </div>
        </>
      )}
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default SiteSoilsCarbonStorage;
