import Accordion from "@codegouvfr/react-dsfr/Accordion";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  surfaceArea: number;
  computationContext: {
    location: {
      lat: number;
      long: number;
      elevation: number;
    };
    dataSources: {
      radiation: string;
      meteo: string;
      period: string;
      horizon?: string;
    };
    pvInstallation: {
      slope: { value: number; optimal: boolean };
      azimuth: { value: number; optimal: boolean };
      type: string;
      technology: string;
      peakPower: number;
      systemLoss: number;
    };
  };
};

function ExpectedAnnualProductionInstructions({ computationContext, surfaceArea }: Props) {
  return (
    <>
      <Accordion label="En savoir plus sur le calcul de cette donnée">
        <>
          <h3>Données d’entrée :</h3>
          <ul>
            <li>
              Coordonnées géographiques : {computationContext.location.lat},{" "}
              {computationContext.location.long}
            </li>
            <li>Altitude : {formatNumberFr(computationContext.location.elevation)} m</li>
            <li>
              Puissance de crềte de l’installation :{" "}
              {formatNumberFr(computationContext.pvInstallation.peakPower)} kWc
            </li>
            <li>Superficie l’installation : {formatNumberFr(surfaceArea)} m²</li>
            <li>
              Position : libre
              <button
                className="fr-btn--tooltip fr-btn"
                id="button-position"
                aria-describedby="tooltip-position"
              >
                Information contextuelle
              </button>
              <span
                className="fr-tooltip fr-placement"
                id="tooltip-position"
                role="tooltip"
                aria-hidden="true"
              >
                Cela signifie que les panneaux sont montés sur une structure de support qui permet
                la libre circulation d'air derrière les modules.
              </span>
            </li>
            <li>Technologie : Silicium cristallin</li>
          </ul>
          <h4>Options de le l’outil PVGIS :</h4>
          <ul>
            <li>
              Pertes estimées du système : {computationContext.pvInstallation.systemLoss} %
              <button
                className="fr-btn--tooltip fr-btn"
                id="button-loss"
                aria-describedby="tooltip-loss"
              >
                Information contextuelle
              </button>
              <span
                className="fr-tooltip fr-placement"
                id="tooltip-loss"
                role="tooltip"
                aria-hidden="true"
              >
                Les pertes estimées du système sont toutes les pertes dans le système qui font que
                la puissance vraiment délivrée sur le réseau électrique est plus basse que la
                puissance produite par les modules. <br />
                <br />
                Il y a plusieurs causes de ces pertes, comme les pertes dues au câblage, à
                l'onduleur, à la saleté sur les modules, etc. <br />
                Par défaut, la perte est définie à 14%.
              </span>
            </li>
            <li>
              Horizon calculé : {computationContext.dataSources.horizon ? "Oui" : "Non"}
              <button
                className="fr-btn--tooltip fr-btn"
                id="button-horizon"
                aria-describedby="tooltip-horizon"
              >
                Information contextuelle
              </button>
              <span
                className="fr-tooltip fr-placement"
                id="tooltip-horizon"
                role="tooltip"
                aria-hidden="true"
              >
                La radiation solaire et la production d'électricité photovoltaïque changent s'il y a
                des collines ou des montagnes voisines qui bloquent la radiation solaire pour
                quelques périodes du jour. <br />
                PVGIS peut calculer cet effet en utilisant les données de l'élévation de la région
                avoisinante qui ont une résolution de 3 secondes d'arc (environ 90 m).
                <br />
                Ce calcul ne tient pas compte des ombres portées par les objets proches comme
                maisons ou arbres.
              </span>
            </li>
            <li>
              Angle : {computationContext.pvInstallation.slope.value}°
              <button
                className="fr-btn--tooltip fr-btn"
                id="button-slope"
                aria-describedby="tooltip-slope"
              >
                Information contextuelle
              </button>
              <span
                className="fr-tooltip fr-placement"
                id="tooltip-slope"
                role="tooltip"
                aria-hidden="true"
              >
                C'est l'angle entre le plan des panneaux photovoltaïques et l'horizontale, pour un
                montage fixe (sans système de suivi).
              </span>
            </li>
            <li>
              Azimut : {computationContext.pvInstallation.azimuth.value}°
              <button
                className="fr-btn--tooltip fr-btn"
                id="button-azimuth"
                aria-describedby="tooltip-azimuth"
              >
                Information contextuelle
              </button>
              <span
                className="fr-tooltip fr-placement"
                id="tooltip-azimuth"
                role="tooltip"
                aria-hidden="true"
              >
                C'est l'angle des panneaux photovoltaïques par rapport à la direction sud. -90° est
                est, 0° est sud et 90° est ouest.
              </span>
            </li>
          </ul>

          <h4>Bases de données PVGIS :</h4>
          <ul>
            <li>Météo : {computationContext.dataSources.meteo}</li>
            <li>Radiations : {computationContext.dataSources.radiation}</li>
            {computationContext.dataSources.horizon && (
              <li>Horizon : {computationContext.dataSources.horizon}</li>
            )}
            <li>Période : {computationContext.dataSources.period}</li>
          </ul>
          <a
            title="Source des données PGVIS - ouvre une nouvelle fenêtre"
            target="_blank"
            rel="noopener noreferrer external"
            href="https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/pvgis-data-download_en"
          >
            Source des données
          </a>
        </>
      </Accordion>
    </>
  );
}

export default ExpectedAnnualProductionInstructions;
