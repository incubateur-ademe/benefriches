import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";

type Props = {
  siteSurfaceArea: number;
};

const AvoidedSecurityCostsDescription = ({ siteSurfaceArea }: Props) => {
  return (
    <>
      <p>
        Afin d’éviter que le site ne dégrade de manière naturelle ou par l’intermédiaire de
        dégradation volontaire ou de vandalisme (ex&nbsp;: vol de métaux, casse de vitres, incendie)
        ou de squats, engendrant une perte financière (valeur du bien) voire une augmentation des
        dépenses de réhabilitation, un gardiennage du site peut être nécessaire.
      </p>
      <p>
        <strong>Bénéficiaire</strong> : actuel exploitant
      </p>
      <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
      <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
      <ul>
        <li>Coût moyen de gardiennage (exprimé en €/ha/an)</li>
      </ul>
      <ModalTitleThree> Données du site</ModalTitleThree>
      <p>Il s’agit de la surface totale occupée par le site (exprimée en hectare).</p>
      <ul>
        <li>{formatSurfaceArea(siteSurfaceArea)}</li>
      </ul>
      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
      <p>
        Le calcul est le produit de la surface du site (exprimée en hectare) par le coût moyen de
        gardiennage (exprimé en €/ha/an).
      </p>
      <ModalTitleTwo>Sources</ModalTitleTwo>
      <ul>
        <li>
          <ExternalLink href="https://hal.archives-ouvertes.fr/tel-01869918/document">
            Tendero Marjorie. Reconversion et aménagement durable des friches urbaines polluées :
            élaboration d'une méthode participative d'évaluation et d'aide multicritère à la
            décision. 2018. Agrocampus Ouest, Université de Bretagne Loire. Thèse ADEME
          </ExternalLink>
        </li>
        <li>
          Marchés de gardiennage de sites, passés par l’ADEME dans le cadre de sa mission de mise en
          sécurité de sites à responsables défaillants dans le cadre de l’Avis du Lien 3
        </li>
      </ul>

      <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
      <ul>
        <li>
          <ExternalLink href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047553584">
            Avis relatif au processus d'intervention de l'ADEME en contexte de sites à responsables
            défaillants
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};

export default AvoidedSecurityCostsDescription;
