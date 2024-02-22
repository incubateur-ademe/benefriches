import Accordion from "@codegouvfr/react-dsfr/Accordion";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import TooltipInfoButton from "@/shared/views/components/TooltipInfoButton/TooltipInfoButton";

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
              <TooltipInfoButton
                text="Cela signifie que les panneaux sont montés sur une structure de support qui permet
                la libre circulation d'air derrière les modules."
                id="pv-position"
              />
            </li>
            <li>Technologie : Silicium cristallin</li>
          </ul>
          <h4>Options de le l’outil PVGIS :</h4>
          <ul>
            <li>
              Pertes estimées du système : {computationContext.pvInstallation.systemLoss} %
              <TooltipInfoButton
                text={
                  <>
                    Les pertes estimées du système sont toutes les pertes dans le système qui font
                    que la puissance vraiment délivrée sur le réseau électrique est plus basse que
                    la puissance produite par les modules. <br />
                    <br />
                    Il y a plusieurs causes de ces pertes, comme les pertes dues au câblage, à
                    l'onduleur, à la saleté sur les modules, etc. <br />
                    Par défaut, la perte est définie à 14%.
                  </>
                }
                id="pv-loss"
              />
            </li>
            <li>
              Horizon calculé : {computationContext.dataSources.horizon ? "Oui" : "Non"}
              <TooltipInfoButton
                text={
                  <>
                    La radiation solaire et la production d'électricité photovoltaïque changent s'il
                    y a des collines ou des montagnes voisines qui bloquent la radiation solaire
                    pour quelques périodes du jour. <br />
                    PVGIS peut calculer cet effet en utilisant les données de l'élévation de la
                    région avoisinante qui ont une résolution de 3 secondes d'arc (environ 90 m).
                    <br />
                    Ce calcul ne tient pas compte des ombres portées par les objets proches comme
                    maisons ou arbres.
                  </>
                }
                id="pv-horizon"
              />
            </li>
            <li>
              Angle : {computationContext.pvInstallation.slope.value}°
              <TooltipInfoButton
                text={
                  <>
                    C'est l'angle entre le plan des panneaux photovoltaïques et l'horizontale, pour
                    un montage fixe (sans système de suivi).
                  </>
                }
                id="pv-slope"
              />
            </li>
            <li>
              Azimut : {computationContext.pvInstallation.azimuth.value}°
              <TooltipInfoButton
                text={
                  <>
                    C'est l'angle des panneaux photovoltaïques par rapport à la direction sud.{" "}
                    <br />
                    -90° est est, 0° est sud et 90° est ouest.
                  </>
                }
                id="pv-azimuth"
              />
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
