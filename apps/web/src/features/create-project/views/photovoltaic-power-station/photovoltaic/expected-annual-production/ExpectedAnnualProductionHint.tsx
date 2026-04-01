import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

type Props = {
  expectedPerformanceMwhPerYear?: number;
};

function ExpectedAnnualProductionHint({ expectedPerformanceMwhPerYear }: Props) {
  return expectedPerformanceMwhPerYear ? (
    <>
      <p>
        D'après la puissance de crête de l'installation et sa situation géographique (adresse), vous
        pouvez espérer produire en moyenne {formatNumberFr(expectedPerformanceMwhPerYear)} MWh par
        an.
      </p>
      <p>
        La valeur qui vous est proposée a été calculée à partir des données de l'outil{" "}
        <ExternalLink
          title="Site du Photovoltaic Geographical Information System - ouvre une nouvelle fenêtre"
          href="https://re.jrc.ec.europa.eu/pvg_tools/fr/"
        >
          PVGIS
        </ExternalLink>
      </p>

      <p>Vous pouvez modifier cette valeur.</p>
    </>
  ) : (
    <p>
      Nous n'avons pas réussi à pré-calculer votre potentielle production annuelle. Vous pouvez
      évaluer votre production grâce à l'outil{" "}
      <ExternalLink
        title="Site du Photovoltaic Geographical Information System - ouvre une nouvelle fenêtre"
        href="https://re.jrc.ec.europa.eu/pvg_tools/fr/"
      >
        PVGIS.
      </ExternalLink>
    </p>
  );
}

export default ExpectedAnnualProductionHint;
