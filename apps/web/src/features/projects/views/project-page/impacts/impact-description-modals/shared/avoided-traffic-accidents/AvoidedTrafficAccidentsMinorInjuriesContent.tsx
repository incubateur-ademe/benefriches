import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalTitleThree from "../ModalTitleThree";
import ModalTitleTwo from "../ModalTitleTwo";
import LinkToAvoidedKilometersImpact from "../avoided-kilometers-social-impact-link/AvoidedKilometersSocialImpactLink";
import TravelRelatedImpactsIntroduction from "../travel-related-impacts-introduction/TravelRelatedImpactsIntroduction";

type Props = {
  withMonetarisation?: boolean;
};

const AvoidedTrafficAccidentsMinorInjuriesContent = ({ withMonetarisation }: Props) => {
  return (
    <>
      <TravelRelatedImpactsIntroduction />

      <p>
        La réduction des déplacements attendue par la réalisation du projet urbain en centralité
        conduira à un risque d’accident réduit, que ce soit des dégâts matériels ou humains (dont
        des blessés légers).
      </p>
      {withMonetarisation && (
        <p>
          En socio-économie, il est possible de déterminer une valeur associé à une réduction de ces
          risques d’accident et d’atteintes corporelles qui en découlent (blessés ou décès).{" "}
        </p>
      )}
      <p>
        <strong>Bénéficiaire</strong> : société française
      </p>
      <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
      <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
      <ul>
        <li>Densité de population communale</li>
        {withMonetarisation && <li>Valeur du coût d’un blessé léger (exprimée en €/unité)</li>}

        <li>Nombre de blessés légers par accident (exprimé en unité/100accidents)</li>
        <li>
          Taux d'occupation moyen des véhicules (exprimé en nombre de personne / véhicule) : 1,45
        </li>
        <li>
          Pour les autres données, se référer à l’indicateur d’impact social{" "}
          <LinkToAvoidedKilometersImpact />
        </li>
      </ul>

      <ModalTitleThree>Données du projet :</ModalTitleThree>

      <p>
        Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d’une moyenne ou d’une hypothèse.
      </p>
      <p>
        Se référer à l’indicateur <LinkToAvoidedKilometersImpact />
      </p>

      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>

      <p>Plusieurs paramètres sont utilisés :</p>

      <ul>
        <li>
          un taux d’accident (exprimé en nombre d’accidents pour 10^8 véhicule.km) associé aux types
          de routes que l’on considère comme plus empruntées du fait de la réduction des
          déplacements attendue par la réalisation du projet,
        </li>
        <li>
          un taux de blessés légers par accident (exprimé en nombre de blessés légers pour 100
          accidents), qui est fonction de la densité de population,
        </li>
        <li>
          la distance des déplacement évités (cf. indicateur <LinkToAvoidedKilometersImpact />{" "}
          exprimé en “nombre de voyageur.km”),
        </li>
      </ul>

      <p>Le nombre de blessés légers évités est égal au produit entre ces 3 paramètres. </p>

      {withMonetarisation && (
        <p>
          Le calcul économique consiste à multiplier ce nombre de blessés à la valeur du coût d’un
          blessé léger (exprimée en €/unité).
        </p>
      )}

      <ModalTitleTwo>Sources</ModalTitleTwo>

      <ul>
        <li>
          <ExternalLink href="https://librairie.ademe.fr/changement-climatique-et-energie/3772-evaluer-les-benefices-socio-economiques-de-la-reconversion-de-friches-pour-lutter-contre-l-artificialisation-outil-benefriches.html">
            Référentiel Bénéfriches&nbsp;
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.ecologie.gouv.fr/politiques-publiques/evaluation-projets-transport#fiches-outils-du-referentiel-devaluation-des-projets-de-transport-4">
            Fiches outils de l’instruction du Gouvernement du 16 juin 2014 - Cadre général de
            l’évaluation des projets d’infrastructures et de services de transport
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};

export default AvoidedTrafficAccidentsMinorInjuriesContent;
