import { useEffect } from "react";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";

import { ProjectAndSiteSoilsCarbonStorageResult } from "@/features/create-project/application/soilsCarbonStorage.actions";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import SoilsCarbonStorageChart from "@/shared/views/components/Charts/SoilsCarbonStorageChart";

type Props = {
  onNext: () => void;
  loading: boolean;
  siteCarbonStorage?: ProjectAndSiteSoilsCarbonStorageResult["siteCarbonStorage"];
  projectCarbonStorage?: ProjectAndSiteSoilsCarbonStorageResult["projectCarbonStorage"];
  fetchSoilsCarbonStorage: () => void;
};

const ProjectSoilsCarbonStorage = ({
  onNext,
  loading,
  siteCarbonStorage,
  projectCarbonStorage,
  fetchSoilsCarbonStorage,
}: Props) => {
  useEffect(() => {
    fetchSoilsCarbonStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p>Calcul du pouvoir de stockage de carbone par les sols...</p>;
  }

  if (siteCarbonStorage === undefined || projectCarbonStorage === undefined) {
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

  const diffCarbonStorage =
    projectCarbonStorage?.totalCarbonStorage -
    siteCarbonStorage?.totalCarbonStorage;
  const isDiffPositive = diffCarbonStorage > 0;
  return (
    <>
      <h2>Stockage du carbone par les sols</h2>
      {isDiffPositive ? (
        <>
          <p>Bonne nouvelle !</p>
          <p>
            Ce site pourrait stocker{" "}
            <strong>
              {formatNumberFr(diffCarbonStorage)} tonnes de carbone en plus.
            </strong>
          </p>
        </>
      ) : (
        <p>
          Ce site stockerait{" "}
          <strong>
            {formatNumberFr(Math.abs(diffCarbonStorage))} tonnes de carbone en
            moins.
          </strong>
        </p>
      )}
      <p></p>
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-6">
          <h3>
            Avant : {formatNumberFr(siteCarbonStorage.totalCarbonStorage)}{" "}
            tonnes de CO2-eq stockées
          </h3>
          <SoilsCarbonStorageChart
            soilsCarbonStorage={siteCarbonStorage.soilsStorage}
          />
        </div>

        <div className="fr-col-6">
          <h3>
            Après : {formatNumberFr(projectCarbonStorage.totalCarbonStorage)}{" "}
            tonnes de CO2-eq stockées
          </h3>
          <SoilsCarbonStorageChart
            soilsCarbonStorage={projectCarbonStorage.soilsStorage}
          />
        </div>
      </div>

      <Button nativeButtonProps={{ type: "submit" }} onClick={onNext}>
        Suivant
      </Button>
    </>
  );
};

export default ProjectSoilsCarbonStorage;
