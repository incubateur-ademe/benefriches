import { useEffect } from "react";

import { formatCarbonStorage } from "@/features/create-project/views/soils/soils-carbon-storage/formatCarbonStorage";
import { SiteCarbonStorage } from "@/features/create-site/application/siteSoilsCarbonStorage.reducer";
import { getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/domain/carbonEmissions";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SoilsCarbonStorageChart from "@/shared/views/components/Charts/SoilsCarbonStorageChart";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
  siteCarbonStorage?: SiteCarbonStorage;
  fetchSiteCarbonStorage: () => void;
};

const SiteSoilsCarbonStorage = ({
  onNext,
  onBack,
  loading,
  siteCarbonStorage,
  fetchSiteCarbonStorage,
}: Props) => {
  useEffect(() => {
    fetchSiteCarbonStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WizardFormLayout
      title="Stockage du carbone par les sols"
      instructions={
        <FormDefinition>
          <p>
            Le sol est un milieu vivant composé de minéraux (ex&nbsp;: pierre, argile) mais
            également de matière organique, issue de la dégradation de végétaux (ex&nbsp;: l'humus
            des forêts) mais également des organismes vivants qu'il contient&nbsp;: faune, flore,
            champignons, micro-organismes.
          </p>
          <p>
            Le sol est ainsi un milieu vivant qui contient une certaine quantité de carbone à un
            moment donné (notion de stock) et qui varie dans le temps (notion de flux). Flux et
            stock dépendent notamment du type de sol mais également du climat.
          </p>
          <p>
            Les calculs sont réalisés à partir des données de référence, exprimées en tonne
            d'équivalent carbone par hectare de sol sur une durée de 50 ans, de l'outil ALDO
            développé par l'ADEME. Dans un souci de simplification, seules les valeurs de stocks
            sont utilisées (on ne considère pas les flux).
          </p>
          Sources&nbsp;:
          <ul>
            <li>
              Stocks de carbone&nbsp;:{" "}
              <a
                title="Documentation d'ALDO - ouvre une nouvelle fenêtre"
                target="_blank"
                rel="noopener noreferrer external"
                href="https://aldo-carbone.ademe.fr/"
              >
                ALDO
              </a>
            </li>
            <li>
              Notions de stock, flux et paramètre d'influence&nbsp;:{" "}
              <a
                title="Définitions d'ALDO - ouvre une nouvelle fenêtre"
                target="_blank"
                rel="noopener noreferrer external"
                href="https://docs.datagir.ademe.fr/documentation-aldo/introduction/definitions"
              >
                Définitions ALDO
              </a>
            </li>
            <li>
              Empreinte carbone moyenne annuelle d'un.e français.e&nbsp;:{" "}
              <a
                title="L'empreinte carbone de la France de 1995 à 2022 sur statistiques.developpement-durable.gouv.fr - ouvre une nouvelle fenêtre"
                target="_blank"
                rel="noopener noreferrer external"
                href="https://www.statistiques.developpement-durable.gouv.fr/lempreinte-carbone-de-la-france-de-1995-2022"
              >
                9,2 tCO2eq
              </a>
            </li>
          </ul>
        </FormDefinition>
      }
    >
      {loading && <LoadingSpinner loadingText="Calcul du stockage de carbone du site..." />}
      {siteCarbonStorage && (
        <>
          <p>
            Ce site stocke environ <strong>{formatCarbonStorage(siteCarbonStorage.total)} t</strong>{" "}
            de carbone.
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
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default SiteSoilsCarbonStorage;
