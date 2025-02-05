import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";
import LinkToAvoidedKilometersImpact from "../../shared/avoided-kilometers-social-impact-link/AvoidedKilometersSocialImpactLink";
import TravelRelatedImpactsIntroduction from "../../shared/travel-related-impacts-introduction/TravelRelatedImpactsIntroduction";
import { economicIndirectBreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

const TITLE = "Dépenses de réparation évitées";

type Props = {
  impactData?: number;
};

const AvoidedPropertyDamagesExpenses = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title={`🚙 ${TITLE}`}
        subtitle="Grâce aux déplacements évités"
        value={
          impactData
            ? {
                state: "success",
                text: formatMonetaryImpact(impactData),
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          economicIndirectBreadcrumbSection,
          { label: TITLE },
        ]}
      />
      <ModalContent fullWidth>
        <>
          <TravelRelatedImpactsIntroduction />

          <p>
            La réduction des déplacements attendue par la réalisation du projet urbain en centralité
            conduira à un risque d’accident réduit, que ce soit des dégâts matériels ou humains.
          </p>
          <p>
            En socio-économie, il est possible de déterminer une valeur associée à une réduction de
            ces risques d’accident et aux dégâts matériels associés.
          </p>
          <p>
            <strong>Bénéficiaire</strong> : société française
          </p>
          <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
          <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
          <ul>
            <li>Densité de population communale</li>
            <li>Valeur du coût des dégâts matériels (exprimée en €/unité)</li>
            <li>
              Nombre d’accident évité (exprimé en unité/100accidents) : variable selon les types de
              routes que l’on considère comme plus empruntées du fait de la réduction des
              déplacements attendue par la réalisation du projet{" "}
            </li>
            <li>
              Taux d'occupation moyen des véhicules (exprimé en nombre de personne / véhicule) :
              1,45
            </li>
            <li>
              Pour les autres données, se référer à l’indicateur d’impact social{" "}
              <LinkToAvoidedKilometersImpact />
            </li>
          </ul>

          <ModalTitleThree>Données du projet :</ModalTitleThree>

          <p>
            Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été
            suggérées par Bénéfriches sur la base d’une moyenne ou d’une hypothèse.
          </p>
          <p>
            Se référer à l’indicateur <LinkToAvoidedKilometersImpact />
          </p>

          <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>

          <p>Plusieurs paramètres sont utilisés :</p>

          <ul>
            <li>
              un taux d’accident (exprimé en nombre d’accidents pour 10^8 véhicule.km) associé aux
              types de routes que l’on considère comme plus empruntées du fait de la réduction des
              déplacements attendue par la réalisation du projet,
            </li>
            <li>
              taux d'occupation moyen des véhicules (exprimé en nombre de personne / véhicule)
            </li>
            <li>
              la distance des déplacement évités (cf. indicateur <LinkToAvoidedKilometersImpact />{" "}
              exprimé en “nombre de voyageur.km”),
            </li>
          </ul>

          <p>
            Le calcul économique consiste à multiplier ces 3 paramètres par la valeur du coût des
            dégâts matériels (exprimée en €/unité).
          </p>

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
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedPropertyDamagesExpenses;
