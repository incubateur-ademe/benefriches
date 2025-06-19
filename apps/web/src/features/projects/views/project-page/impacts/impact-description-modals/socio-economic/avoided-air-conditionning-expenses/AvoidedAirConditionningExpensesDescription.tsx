import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { economicIndirectBreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactData?: number;
};

const AvoidedAirConditionningExpensesDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="❄️ Dépenses de climatisation évitées"
        value={
          impactData
            ? {
                state: "success",
                text: formatMonetaryImpact(impactData),
                description: "pour la population locale et les structures locales",
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          economicIndirectBreadcrumbSection,
          { label: "Dépenses de climatisation évitées" },
        ]}
      />
      <ModalContent fullWidth>
        <>
          <p>
            La présence de nature en ville peut dans une certaine mesure (type de végétation,
            surface, distance, configuration urbaine, etc.) conduire à des effets mesurables en
            termes de rafraîchissement des bâtiments alentours, conduisant à un moindre besoin en
            rafraîchissement actif (ventilation, climatisation) réduisant d’autant les factures
            d’électricité des équipements associés.
          </p>
          <p>
            <strong>Bénéficiaire</strong> : Population locale et structures locales
          </p>
          <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
          <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
          <ul>
            <li>Facture moyenne annuelle d’énergie des ménages pour leur logement : 1744€</li>
            <li>
              Facture moyenne annuelle d’énergie des locaux d’activités économiques, d’équipements
              et de services : 0,15€/kWhEF pour 164 kWhEF/m² par an.
            </li>
            <li>
              Réduction de la facture en électricité liée aux équipements de rafraîchissement ou de
              climatisation pour baisser la température d’un logement d’1°C : 7%
            </li>

            <li>
              Part de la consommation moyenne d’électricité aux fins de refroidissement (dans les
              logements qui sont équipés de système de climatisation) : 3,4 %
            </li>
            <li>Nombre de ménages présents dans la zone d’influence de l’effet</li>
            <li>
              Surface de locaux d’activités économiques, d’équipements et de services présents dans
              la zone d’influence de l’effet
            </li>

            <li>
              Surface de locaux d’activités économiques, d’équipements et de services présents dans
              la zone d’influence de l’effet (variable selon le projet)
            </li>
            <li>
              Zone d’influence de l’effet «&nbsp;Îlot de fraîcheur&nbsp;»&nbsp;: variable
              selon&nbsp;:
              <ol>
                <li>la nouvelle surface d’espace de nature crée par le projet(m²)</li>
                <li>le % que cette nouvelle surface représente dans le projet</li>
                <li>
                  la distance de l’espace de nature (cette dernière est limitée à 75m, suite à
                  l’analyse de la bibliographie disponible)
                </li>
              </ol>
            </li>
          </ul>
          <ModalTitleThree>Données du projet :</ModalTitleThree>
          <ul>
            <li>
              Nouvelle surface d’espace de nature crée par le projet le cas échéant (exprimée en m²)
            </li>
            <li>
              Surface de nouveaux logements créés par le projet le cas échéant (exprimé en m² SDP)
            </li>
            <li>
              Surface de bâtiments d’activités économiques et d’équipements publics créés par le
              projet (exprimés en m² SDP)
            </li>
          </ul>
          <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
          <p>
            Le gain économique annuel sur les factures d’électricité du fait de l’effet « ilot de
            fraicheur » est calculé en additionnant le produit suivant, pour les ménages d’une part
            et les locaux d’activités économiques, d’équipements et de services d’autre part, dans
            la zone d’influence de l’effet :
          </p>
          <p>
            [Réduction de la facture en électricité liée aux équipements de rafraîchissement ou de
            climatisation] <strong>x</strong> [Part de la consommation moyenne d’électricité aux
            fins de refroidissement] <strong>x</strong> [consommation moyenne annuelle
            d’électricité] <strong>x</strong> [nombre de ménage ou nombre de m² de locaux
            d’activités économiques, d’équipements et de services dans la zone d’influence de
            l’effet].
          </p>

          <ModalTitleTwo>Sources</ModalTitleTwo>
          <ul>
            <li>
              ADEME, « Chiffres-clés », Climat, Air et Energie, édition 2014 (p.4 du document)
            </li>

            <li>
              <ExternalLink href="https://base-empreinte.ademe.fr/donnees/jeu-donnees">
                Facteurs d’émission associés à la production de différentes sources d’énergie
              </ExternalLink>
            </li>

            <li>
              Observatoire de l’Immobilier Durable cité par Le Moniteur en référence à la fin de la
              section
            </li>
            <li>
              <ExternalLink href="https://www.ecologie.gouv.fr/sites/default/files/publications/Th%C3%A9ma%20-%20Les%20m%C3%A9nages%20et%20la%20consommation%20d%E2%80%99%C3%A9nergie.pdf">
                Ministère de l’Environnement sur « Les ménages et la consommation d’énergie » de
                mars 2017, édité par le service de l’observation et des statistiques (SoeS)
              </ExternalLink>
            </li>
          </ul>
          <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
          <ul>
            <li>
              <ExternalLink href="https://librairie.ademe.fr/changement-climatique-et-energie/3772-evaluer-les-benefices-socio-economiques-de-la-reconversion-de-friches-pour-lutter-contre-l-artificialisation-outil-benefriches.html">
                Référentiel Bénéfriches
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://librairie.ademe.fr/urbanisme-territoires-et-sols/1170-amenager-avec-la-nature-en-ville.html">
                ADEME (octobre 2018), « Aménager avec la nature en ville », ADEME Editions
              </ExternalLink>
            </li>
          </ul>
        </>
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedAirConditionningExpensesDescription;
