import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalTitleThree from "../ModalTitleThree";
import ModalTitleTwo from "../ModalTitleTwo";

type Props = {
  withMonetarisation?: boolean;
};

const AirConditionningRelatedCo2Content = ({ withMonetarisation = false }: Props) => {
  return (
    <>
      <p>
        La présence de nature en ville peut dans une certaine mesure (type de végétation, surface,
        distance, configuration urbaine, etc.) conduire à des effets mesurables en termes de
        rafraichissement des bâtiments alentours, conduisant à un moindre besoin en rafraichissement
        actif (ventilation, climatisation), réduisant d’autant les émissions de CO2 associée aux
        consommations électriques des équipements.
      </p>
      <p>
        <strong>Bénéficiaire</strong> : humanité
      </p>
      <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
      <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
      <ul>
        <li>
          Consommation moyenne annuelle d’énergie des ménages pour leur logement : 240 kWhep/m² par
          an (« ep » pour énergie primaire)
        </li>
        <li>
          Consommation moyenne annuelle d’énergie des locaux d’activités économiques, d’équipements
          et de services : 0,15€/kWhef (« ef » pour énergie finale) pour 164 kWhEF/m² par an.
        </li>
        <li>
          Réduction de la consommation en électricité liée aux équipements de rafraîchissement ou de
          climatisation pour baisser la température d’un logement d’1°C : 7%
        </li>

        <li>
          Part de la consommation moyenne d’électricité aux fins de refroidissement (dans les
          logements qui sont équipés de système de climatisation) : 3,4 %
        </li>
        <li>
          Ratio de conversion énergie finale / énergie primaire pour le mix électrique en
          France&nbsp;: 0,6 (sans dimension)
        </li>
        <li>Contenu carbone mix électrique en France&nbsp;: 66gCOéq. par kWh d’énergie finale</li>

        {withMonetarisation && (
          <li>
            Valeur tutélaire du carbone (exprimée en €/t éq. CO2) : variable selon l’année, selon
            une trajectoire à la hausse
          </li>
        )}
        <li>
          Surface de logements présents dans la zone d’influence de l’effet (variable selon le
          projet)
        </li>

        <li>
          Surface de locaux d’activités économiques, d’équipements et de services présents dans la
          zone d’influence de l’effet (variable selon le projet)
        </li>
        <li>
          Zone d’influence de l’effet «&nbsp;Îlot de fraîcheur&nbsp;»&nbsp;: variable selon&nbsp;:
          <ol>
            <li>la nouvelle surface d’espace de nature crée par le projet(m²)</li>
            <li>le % que cette nouvelle surface représente dans le projet</li>
            <li>
              la distance de l’espace de nature (cette dernière est limitée à 75m, suite à l’analyse
              de la bibliographie disponible)
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
          Surface de nouveaux locaux d’activités économiques, d’équipements et de services créés par
          le projet le cas échéant (exprimé en m² SDP)
        </li>
      </ul>
      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
      {withMonetarisation ? (
        <>
          <p>
            La monétarisation de l’utilisation réduite de la climatisation consiste à multiplier la
            valeur de cet indicateur d’impact par la valeur tutélaire du carbone (ou valeur d’action
            pour le climat).
          </p>
          <p>
            L’indicateur d’impact environnemental “utilisation réduite de la climatisation”
            correspond à la quantité de CO2 évitée annuellement liée à la moindre consommation
            électrique d’équipements de rafraîchissement du fait de l’effet «&nbsp;îlot de
            fraîcheur&nbsp;». Il est calculé en additionnant le produit suivant, pour les ménages
            d’une part et les locaux d’activités économiques, d’équipements et de services d’autre
            part, dans la zone d’influence de l’effet&nbsp;:
          </p>
        </>
      ) : (
        <p>
          La quantité de CO2 évitée annuellement liée à la moindre consommation électrique
          d’équipements de rafraîchissement du fait de l’effet «&nbsp;îlot de fraîcheur&nbsp;» est
          calculé en additionnant le produit suivant, pour les ménages d’une part et les locaux
          d’activités économiques, d’équipements et de services d’autre part, dans la zone
          d’influence de l’effet&nbsp;:{" "}
        </p>
      )}
      <p>
        [Réduction de la consommation électrique (en énergie primaire) liée aux équipements de
        rafraîchissement ou de climatisation] <strong>x</strong> [Part de la consommation moyenne
        d’électricité aux fins de refroidissement] <strong>x</strong> [consommation moyenne annuelle
        d’électricité] <strong>x</strong> [Ratio de conversion énergie finale / énergie primaire
        pour le mix électrique] <strong>x</strong> [contenu en CO2éq. du mix électrique (en énergie
        finale)] <strong>x</strong> [de m² de logements ou nombre de m² de locaux d’activités
        économiques, d’équipements et de services dans la zone d’influence de l’effet].
      </p>
      <ModalTitleTwo>Sources</ModalTitleTwo>
      <ul>
        <li>ADEME, « Chiffres-clés », Climat, Air et Energie, édition 2014 (p.4 du document)</li>

        <li>
          <ExternalLink href="https://base-empreinte.ademe.fr/donnees/jeu-donnees">
            Facteurs d’émission associés à la production de différentes sources d’énergie
          </ExternalLink>
        </li>
        {withMonetarisation && (
          <li>
            <ExternalLink href="https://www.strategie.gouv.fr/sites/strategie.gouv.fr/files/atoms/files/fs-2019-rapport-la-valeur-de-laction-pour-le-climat_0.pdf">
              Valeur tutélaire du carbone
            </ExternalLink>
          </li>
        )}

        <li>
          Observatoire de l’Immobilier Durable cité par Le Moniteur en référence à la fin de la
          section
        </li>
        <li>
          <ExternalLink href="https://www.ecologie.gouv.fr/sites/default/files/publications/Th%C3%A9ma%20-%20Les%20m%C3%A9nages%20et%20la%20consommation%20d%E2%80%99%C3%A9nergie.pdf">
            Ministère de l’Environnement sur « Les ménages et la consommation d’énergie » de mars
            2017, édité par le service de l’observation et des statistiques (SoeS)
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
  );
};

export default AirConditionningRelatedCo2Content;
