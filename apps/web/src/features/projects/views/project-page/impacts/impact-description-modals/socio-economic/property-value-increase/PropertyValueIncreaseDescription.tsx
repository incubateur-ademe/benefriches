import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";

import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

type Props = {
  siteSurfaceArea: number;
};

const PropertyValueIncreaseDescription = ({ siteSurfaceArea }: Props) => {
  return (
    <>
      <p>
        La reconversion d’une friche urbaine, du fait de la transformation d’un espace plus ou moins
        ancien et dégradé, se traduit par une amélioration du cadre de vie des riverains du projet.
        La bibliographie met en évidence un effet positif engendré par la suppression d’une friche
        polluée pour les riverains et ce, d’autant plus que l’espace crée est un espace de nature.
      </p>
      <p>
        <strong>Bénéficiaire</strong> : Riverains
      </p>
      <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
      <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
      <ul>
        <li>Densité de population communale (exprimée en nombre d’habitants par km²) </li>
        <li>Nombre moyen de m² de logement par habitant (habitat collectif)&nbsp;: 32</li>
        <li>
          Valeur immobilière des logements dans le périmètre d'influence de la reconversion
          (exprimées en €/m²)
        </li>
        <li>
          Périmètre d'influence du projet de reconversion sur les valeurs immobilières&nbsp;: 200 m
        </li>
        <li>
          Taux d’effet du projet de reconversion sur les valeurs immobilières&nbsp;: 3.5% jusqu’à
          100m du site et 3% entre 100 et 200m. Pas d’effet au-delà.
        </li>
        <li>
          Part logements sociaux dans le périmètre d'influence (quartier ou commune)&nbsp;: 20%
        </li>
        <li>Durée moyenne de détention d’un logement&nbsp;: 33 ans</li>
      </ul>
      <ModalTitleThree>Données du site :</ModalTitleThree>
      <p>
        Les données du site peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit ici de la surface du
        site (exprimée en hectare).
      </p>
      <ul>
        <li>{formatSurfaceArea(siteSurfaceArea)}</li>
      </ul>
      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
      <p>
        L’impact économique de la reconversion sur les valeurs immobilières est calculé en plusieurs
        étapes :
      </p>
      <ul>
        <li>
          Calcul de la surface de logements (exprimée en m²) présente dans le périmètre d’influence
          du projet de reconversion&nbsp;: cette surface est égale au produit des 3 valeurs
          suivantes (i) la densité de population locale, (ii) le nombre moyen de m² de logement par
          habitant correspondante et (iii) aire présente dans le périmètre d’influence du projet
          (considéré comme un disque). Ce calcul est fait en excluant les logements sociaux.
        </li>
        <li>
          Pour chaque tranche de taux d’effet du projet de reconversion sur les valeurs
          immobilières, calcul de la valeur patrimoniale (exprimée en €) des logements présents dans
          le périmètre d’influence&nbsp;: cette valeur est le produit de la valeur immobilière des
          logements par la surface de logement calculée préalablement.
        </li>
        <li>
          Pour chaque tranche de taux d’effet du projet de reconversion sur les valeurs
          immobilières, calcul de l’augmentation de valeur patrimoniale (exprimée en €) pouvant être
          attendu du fait de la réalisation du projet par application du taux d’effet correspondant.
        </li>
        <li>
          Addition des augmentations de valeur patrimoniale sur les 2 tranches de taux d’effet.
        </li>
      </ul>
      <ModalTitleTwo>Sources</ModalTitleTwo>
      <ul>
        <li>
          <ExternalLink href="https://geo.api.gouv.fr/decoupage-administratif/communes">
            Etalab, Population par commune
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.insee.fr/fr/statistiques/1287961?sommaire=1912749">
            Nombre de m² de logement par habitant&nbsp;: Enquête logement INSEE (2013)
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://explore.data.gouv.fr/fr/immobilier?onglet=carte&filtre=tous">
            Prix de ventes immobilières à la parcelle cadastrale
          </ExternalLink>
        </li>
        <li>
          Impact de la suppression d’une friche urbaine sur les prix immobilier&nbsp;:{" "}
          <ExternalLink href="https://www.cairn.info/revue-d-economie-regionale-et-urbaine-2001-4-page-605.htm">
            ZUINDEAU Bertrand, LETOMBE Gwénaël (2001). L'impact des friches industrielles sur les
            valeurs immobilières : une application de la méthode des prix hédoniques à
            l'arrondissement de Lens (Nord – Pas de Calais), Revue d'économie régionale et urbaine,
            Armand Colin, vol. 0(4), pages 605-624
          </ExternalLink>
        </li>
        <li>
          Impact de la création d’un espace de nature en ville sur les prix immobilier&nbsp;:
          <ExternalLink href="https://www.researchgate.net/publication/322267105_A_meta-analysis_framework_for_assessing_the_economic_benefits_of_NBS">
            BOCKARJOVA Marija, WOUTER BOTZNE W.J. (2017). A meta-analysis framework for assessing
            the economic benefits of NBS, Naturvation, Utrecht Univeristy
          </ExternalLink>
        </li>
        <li>
          Durée moyenne détention logement&nbsp;:{" "}
          <ExternalLink href="https://www.statistiques.developpement-durable.gouv.fr/sites/default/files/2018-10/Chiffres_stats%20343.pdf">
            Les conditions d’occupation des logements au 1er janvier 2011, Chiffres et statistiques,
            n°343, 6 pages, CGDD, 2012
          </ExternalLink>
        </li>
      </ul>
      <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
      <ExternalLink href="https://librairie.ademe.fr/changement-climatique-et-energie/3772-evaluer-les-benefices-socio-economiques-de-la-reconversion-de-friches-pour-lutter-contre-l-artificialisation-outil-benefriches.html">
        Référentiel Bénéfriches
      </ExternalLink>
    </>
  );
};

export default PropertyValueIncreaseDescription;
