import ModalTitleThree from "./ModalTitleThree";
import ModalTitleTwo from "./ModalTitleTwo";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

type Props = {
  address: string;
  developmentPlanSurfaceArea?: number;
  developmentPlanElectricalPowerKWc?: number;
  withMonetarisation: boolean;
};

const AvoidedCO2WithEnRDescription = ({
  address,
  developmentPlanSurfaceArea,
  developmentPlanElectricalPowerKWc,
  withMonetarisation,
}: Props) => {
  return (
    <>
      <p>
        La production d’énergie renouvelable (photovoltaïque, géothermique, etc.) présente un
        caractère faiblement carboné en regard d’autres sources d’énergie notamment d’origine
        fossile, qu’il est pertinent de prendre en compte dans une analyse coûts-bénéfices.
      </p>
      <p>
        Bénéfriches fait l’hypothèse que cette production vient se substituer à un accroissement de
        la production d’énergie selon le mix énergétique français.
      </p>
      <p>
        <strong>Bénéficiaire</strong> : société humaine
      </p>
      <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
      <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
      <ul>
        <li>
          Facteurs d’émission associés à la production de différentes sources d’énergie (exprimés en
          kg éq. CO2/kWh)
        </li>
        {withMonetarisation && <li>Valeur tutélaire du carbone (exprimée en €/t éq. CO2)</li>}
      </ul>
      <ModalTitleThree> Données du projet</ModalTitleThree>
      <p>
        Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d’une moyenne ou d’une hypothèse.
      </p>
      <ul>
        <li>Adresse : {address}</li>
        <li>
          Surface au sol occupée par les panneaux (exprimée en m²) :{" "}
          {developmentPlanSurfaceArea ? formatNumberFr(developmentPlanSurfaceArea) : "Inconnu"}
        </li>
        <li>
          Puissance installée (exprimée en kWc) :{" "}
          {developmentPlanElectricalPowerKWc
            ? formatNumberFr(developmentPlanElectricalPowerKWc)
            : "Inconnu"}
        </li>
      </ul>
      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
      <p>
        Il s’agit d’un calcul différentiel entre (i) l’impact carbone de la production d’énergie
        associée à la source d’énergie renouvelable du projet et (ii) celui du mixte énergétique
        national.
      </p>
      <p>
        Pour le photovoltaïque, la production d’énergie renouvelable est calculée avec l’outil PVGIS
        de la Commission européenne compte tenu de la puissance crête de votre installation et de la
        situation géographique (adresse) du projet, informations saisies par l’utilisateur. Les
        autres paramètres de l’outil PVGIS ne sont pas modifiés.
      </p>
      <p>
        On fait l’hypothèse que cette production vient se substituer à un accroissement de la
        production d’énergie selon le mix énergétique français.
      </p>
      <p>
        L’impact carbone (exprimé en kg éq. CO2/an) est le produit du facteur d’émission associé à
        une source d’énergie (exprimé en kg éq. CO2/kWh) par la production d’énergie calculée
        (exprimée en kWh/an).
      </p>
      {withMonetarisation && (
        <p>
          La monétarisation de cet impact différentiel consiste à multiplier la valeur d’impact avec
          la valeur tutélaire du carbone (ou valeur d’action pour le climat).
        </p>
      )}

      <ModalTitleTwo>Sources</ModalTitleTwo>
      <ul>
        <li>
          <ExternalLink href="https://base-empreinte.ademe.fr/donnees/jeu-donnees">
            Facteurs d’émission associés à la production de différentes sources d’énergie
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://re.jrc.ec.europa.eu/pvg_tools/fr/">
            Estimation de la production d’énergie photovoltaïque géolocalisée
          </ExternalLink>
        </li>
        {withMonetarisation && (
          <li>
            <ExternalLink href="https://www.strategie.gouv.fr/sites/strategie.gouv.fr/files/atoms/files/fs-2019-rapport-la-valeur-de-laction-pour-le-climat_0.pdf">
              Valeur tutélaire du carbone
            </ExternalLink>
          </li>
        )}
      </ul>
      <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
      <ul>
        {withMonetarisation && (
          <li>
            <ExternalLink href="https://www.ecologie.gouv.fr/sites/default/files/Th%C3%A9ma%20-%20L'analyse%20du%20cycle%20de%20vie%20%20-%20Enjeux%20autour%20de%20la%20mon%C3%A9tarisation.pdf">
              Monétarisation
            </ExternalLink>
          </li>
        )}

        <li>
          <ExternalLink href="https://www.strategie.gouv.fr/infographies/de-laction-climat-cest-quoi">
            Valeur tutélaire du carbone (ou valeur de l’action pour le climat)
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};

export default AvoidedCO2WithEnRDescription;
