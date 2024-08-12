import ModalTitleTwo from "../../shared/ModalTitleTwo";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

const SiteReinstatementDescription = () => {
  return (
    <>
      <p>
        Le recyclage de friches ou de fonciers déjà artificialisés implique le plus souvent des
        études et de travaux du fait des activités passées qu’elles ont accueillies : présence de
        bâtiments, de pollution dans les sols, etc. Le recyclage impose une phase de remise en état,
        préalable à l’aménagement du site : intervention sur les bâtiments (réhabilitation,
        déconstruction, désamiantage, retrait de peintures au plomb), désimperméabilisation des
        sols, dépollution des milieux (sols, eaux souterraines, …), évacuation et traitement de
        déchets présents (dépôts sauvages par exemple), voire restauration écologique des sols.
      </p>
      <p>Cette phase génère des dépenses parfois importantes.</p>
      <p>
        <strong>Déficitaire</strong> : exploitant
      </p>

      <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
      <ul>
        <li>
          ADEME&nbsp;:{" "}
          <ExternalLink href="https://www.reseaunationalamenageurs.logement.gouv.fr/IMG/pdf/4-ademe_rna_2023-11-23.pdf">
            Coût du recyclage des friches ex-ICPE polluées (Analyse des lauréats du Fonds Friches
            2021-2022).
          </ExternalLink>
        </li>
        <li>
          CEREMA&nbsp;:{" "}
          <ExternalLink href="https://www.reseaunationalamenageurs.logement.gouv.fr/IMG/pdf/3-231123_rna_prez_jm.pdf">
            Coût de recyclage des friches non ICPE (Analyse des lauréats du Fonds Friches
            2021-2022).
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};

export default SiteReinstatementDescription;
