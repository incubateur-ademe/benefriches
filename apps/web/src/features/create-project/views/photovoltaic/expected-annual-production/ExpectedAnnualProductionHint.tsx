import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  expectedPerformanceMwhPerYear?: number;
};

function ExpectedAnnualProductionHint({ expectedPerformanceMwhPerYear }: Props) {
  return (
    <>
      {expectedPerformanceMwhPerYear ? (
        <>
          <p>
            D’après la puissance de crête de l'installation, sa superficie au sol et sa situation
            géographique (ensoleillement, horizon, etc.), vous pouvez espérer produire en moyenne{" "}
            {formatNumberFr(expectedPerformanceMwhPerYear)} MWh par an.
          </p>
          <p>
            La valeur qui vous est proposée a été calculée à partir des données du{" "}
            <a
              target="_blank"
              rel="noopener noreferrer external"
              title="Site du Photovoltaic Geographical Information System - ouvre une nouvelle fenêtre"
              href="https://re.jrc.ec.europa.eu/pvg_tools/fr/"
            >
              PVGIS.
            </a>
            <button
              className="fr-btn--tooltip fr-btn"
              id="button-PVGIS"
              aria-describedby="tooltip-PVGIS"
            >
              Information contextuelle
            </button>{" "}
          </p>

          <p>
            Si vous savez que votre production annuelle sera différente, vous pouvez modifier cette
            valeur.
          </p>
        </>
      ) : (
        <p>
          Nous n’avons pas réussi à pré-calculer votre potentielle production annuelle. Vous pouvez
          évaluer votre production grâce à l’outil{" "}
          <a
            target="_blank"
            rel="noopener noreferrer external"
            title="Site du Photovoltaic Geographical Information System - ouvre une nouvelle fenêtre"
            href="https://re.jrc.ec.europa.eu/pvg_tools/fr/"
          >
            PVGIS.
          </a>
          <button
            className="fr-btn--tooltip fr-btn"
            id="button-PVGIS"
            aria-describedby="tooltip-PVGIS"
          >
            Information contextuelle
          </button>
        </p>
      )}

      <span
        className="fr-tooltip fr-placement"
        id="tooltip-PVGIS"
        role="tooltip"
        aria-hidden="true"
      >
        Le <strong>PVGIS (Photovoltaic Geographical Information System)</strong> est un outil
        gratuit en ligne développé par la Commission Européenne qui permet d’évaluer la production
        d’énergie d’une installation photovoltaïque. <br />
        <br />
        Les <strong>paramètres</strong> comprennent le choix de la base de données d’ensoleillement,
        le type de technologie PV, la puissance de crête, les pertes du système, la position de
        montage, l’inclinaison et l’azimut de la centrale solaire.
      </span>
    </>
  );
}

export default ExpectedAnnualProductionHint;
