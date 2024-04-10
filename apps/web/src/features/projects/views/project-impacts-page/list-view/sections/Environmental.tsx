import { convertCarbonToCO2eq } from "../../../shared/convertCarbonToCO2eq";
import ImpactDetailLabel from "../ImpactDetailLabel";
import ImpactDetailRow from "../ImpactItemDetailRow";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactItemRow from "../ImpactItemRow";
import ImpactLabel from "../ImpactLabel";
import ImpactValue from "../ImpactValue";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-impacts-page/modals/ImpactDescriptionModalWizard";
import {
  formatCO2Impact,
  formatSurfaceAreaImpact,
} from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  impacts: ReconversionProjectImpacts;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const EnvironmentalListSection = ({ impacts, openImpactDescriptionModal }: Props) => {
  const soilsStorageCO2eq = convertCarbonToCO2eq(
    impacts.soilsCarbonStorage.forecast.total - impacts.soilsCarbonStorage.current.total,
  );

  return (
    <section className="fr-mb-5w">
      <h3>Impacts environnementaux</h3>
      {impacts.nonContaminatedSurfaceArea && (
        <ImpactItemRow
          onClick={() => {
            openImpactDescriptionModal("environmental-non-contamined-surface");
          }}
        >
          <ImpactLabel>✨ Surface non polluée</ImpactLabel>
          <ImpactValue isTotal>
            {formatSurfaceAreaImpact(
              impacts.nonContaminatedSurfaceArea.forecast -
                impacts.nonContaminatedSurfaceArea.current,
            )}
          </ImpactValue>
        </ImpactItemRow>
      )}
      <ImpactItemGroup>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <ImpactLabel>☁️ CO2-eq stocké ou évité</ImpactLabel>
          <ImpactValue isTotal>
            {formatCO2Impact(
              soilsStorageCO2eq + (impacts.avoidedCO2TonsWithEnergyProduction?.forecast ?? 0),
            )}
          </ImpactValue>
        </div>
        <ImpactDetailRow
          onClick={() => {
            openImpactDescriptionModal("environmental-carbon-storage");
          }}
        >
          <ImpactDetailLabel>🍂 CO2-eq stocké dans les sols</ImpactDetailLabel>
          <ImpactValue>{formatCO2Impact(soilsStorageCO2eq)}</ImpactValue>
        </ImpactDetailRow>
        <ImpactDetailRow
          onClick={() => {
            openImpactDescriptionModal("environmental-avoided-co2-renewable-energy");
          }}
        >
          <ImpactDetailLabel>
            ⚡️ Émissions de CO2-eq évitées grâce à la production d'EnR
          </ImpactDetailLabel>
          <ImpactValue>
            {formatCO2Impact(impacts.avoidedCO2TonsWithEnergyProduction?.forecast ?? 0)}
          </ImpactValue>
        </ImpactDetailRow>
      </ImpactItemGroup>
      <ImpactItemGroup>
        <ImpactItemRow
          isTotal
          onClick={() => {
            openImpactDescriptionModal("environmental-permeable-surface");
          }}
        >
          <ImpactLabel>🌧 Surface perméable</ImpactLabel>
          <ImpactValue isTotal>
            {formatSurfaceAreaImpact(
              impacts.permeableSurfaceArea.forecast - impacts.permeableSurfaceArea.base,
            )}
          </ImpactValue>
        </ImpactItemRow>
        <ImpactDetailRow
          onClick={() => {
            openImpactDescriptionModal("environmental-minerale-surface");
          }}
        >
          <ImpactDetailLabel>🪨 Surface perméable minérale</ImpactDetailLabel>
          <ImpactValue>
            {formatSurfaceAreaImpact(
              impacts.permeableSurfaceArea.mineralSoil.forecast -
                impacts.permeableSurfaceArea.mineralSoil.base,
            )}
          </ImpactValue>
        </ImpactDetailRow>
        <ImpactDetailRow
          onClick={() => {
            openImpactDescriptionModal("environmental-green-surface");
          }}
        >
          <ImpactDetailLabel>🌱 Surface perméable végétalisée</ImpactDetailLabel>
          <ImpactValue>
            {formatSurfaceAreaImpact(
              impacts.permeableSurfaceArea.greenSoil.forecast -
                impacts.permeableSurfaceArea.greenSoil.base,
            )}
          </ImpactValue>
        </ImpactDetailRow>
      </ImpactItemGroup>
    </section>
  );
};

export default EnvironmentalListSection;
