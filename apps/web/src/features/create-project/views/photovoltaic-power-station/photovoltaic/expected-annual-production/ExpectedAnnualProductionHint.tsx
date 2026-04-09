import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import FormAutoInfo from "@/shared/views/layout/WizardFormLayout/FormAutoInfo";

type Props = {
  expectedPerformanceMwhPerYear?: number;
};

function ExpectedAnnualProductionHint({ expectedPerformanceMwhPerYear }: Props) {
  return expectedPerformanceMwhPerYear ? (
    <FormAutoInfo>
      D’où vient la production annuelle pré-remplie ?
      <p>
        Production calculée à partir de la puissance, de la superficie au sol et du taux
        d’ensoleillement moyen dans la zone géographique du site.
      </p>
      <p>
        <ExternalLink
          title="Site du Photovoltaic Geographical Information System - ouvre une nouvelle fenêtre"
          href="https://re.jrc.ec.europa.eu/pvg_tools/fr/"
        >
          En savoir plus
        </ExternalLink>
      </p>
    </FormAutoInfo>
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
