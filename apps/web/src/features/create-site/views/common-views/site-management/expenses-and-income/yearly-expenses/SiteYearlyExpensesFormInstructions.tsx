import { SiteNature } from "shared";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import FormAutoInfo from "@/shared/views/layout/WizardFormLayout/FormAutoInfo";

function SiteYearlyExpensesFormInstructions({ siteNature }: { siteNature: SiteNature }) {
  return (
    <FormAutoInfo>
      D’où viennent les montants pré-remplis&nbsp;?
      <p>
        Montants calculés d’après les informations que vous avez renseigné et les dépenses
        financiers moyens en France de chaque poste de dépense.
      </p>
      <span>Sources&nbsp;:</span>
      {siteNature === "FRICHE" && (
        <ul>
          <li>
            <ExternalLink href="https://www.idfriches-auvergnerhonealpes.fr/sites/default/files/gabarit_-_fiche_pedagogique_optimisation_du_temps_vff.pdf">
              IDFriches, le coût de l'inaction, 2020
            </ExternalLink>
            ;
          </li>
          <li>ADEME, données internes, 2023&nbsp;;</li>
          <li>
            <ExternalLink href="https://hal.science/tel-01869918v1/file/These_Tendero_Marjorie_20180906.pdf">
              Mémoire de thèse de Marjorie Tendero, 2018
            </ExternalLink>
            ;
          </li>
        </ul>
      )}
      {siteNature === "AGRICULTURAL_OPERATION" && (
        <ul>
          <li>
            <ExternalLink href="https://agreste.agriculture.gouv.fr/agreste-web/download/publication/publie/Chd2418/cd2024-18_Rica2023-v2.pdf">
              Résultats économiques des exploitations agricoles en France - Chiffres clés 2023 RICA
            </ExternalLink>
          </li>
        </ul>
      )}
    </FormAutoInfo>
  );
}

export default SiteYearlyExpensesFormInstructions;
