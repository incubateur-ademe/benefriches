import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

function SiteYearlyExpensesFormInstructions() {
  return (
    <>
      <FormInfo>
        <p>
          Les montants pré-remplis (exprimés en € HT) le sont d'après les informations de surface
          que vous avez renseigné et les coûts moyens observés.
        </p>
        <span>Sources&nbsp;:</span>
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
        <p>Vous pouvez modifier ces montants.</p>
      </FormInfo>

      <FormDefinition>
        <p>Un site qui reste en l'état, sans intervention, c'est un site qui coûte.</p>
        <ul>
          <li>De manière directe, via la fiscalité locale (ex&nbsp;: taxe foncière)</li>
          <li>
            De manière indirecte car lorsqu'aucun moyen de préservation n'est mis en œuvre sur un
            site (clôture, gardiennage, taille, etc.), celui-ci se dégrade de manière naturelle ou
            par l'intermédiaire de dégradation volontaire ou de vandalisme (ex&nbsp;: vol de métaux,
            casse de vitres, incendie, dépôts sauvages) ou de squats, engendrant une perte
            financière (valeur du bien) voire une augmentation des dépenses de réhabilitation
            (source&nbsp;:{" "}
            <ExternalLink href="https://www.idfriches-auvergnerhonealpes.fr/sites/default/files/gabarit_-_fiche_pedagogique_optimisation_du_temps_vff.pdf">
              IDFriches, le coût de l'inaction, 2020
            </ExternalLink>
            )
          </li>
        </ul>
        <p>La taxe foncière est due par le propriétaire foncier.</p>
      </FormDefinition>
    </>
  );
}

export default SiteYearlyExpensesFormInstructions;
