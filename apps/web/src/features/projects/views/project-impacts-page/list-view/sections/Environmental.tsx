import { convertCarbonToCO2eq } from "../../../shared/convertCarbonToCO2eq";
import ImpactDetailLabel from "../ImpactDetailLabel";
import ImpactDetailRow from "../ImpactItemDetailRow";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactItemRow from "../ImpactItemRow";
import ImpactLabel from "../ImpactLabel";
import ImpactValue from "../ImpactValue";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-impacts-page/modals/ImpactDescriptionModalWizard";

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
          <ImpactValue
            isTotal
            value={
              impacts.nonContaminatedSurfaceArea.forecast -
              impacts.nonContaminatedSurfaceArea.current
            }
            type="surfaceArea"
          />
        </ImpactItemRow>
      )}
      <ImpactItemGroup>
        <div className="tw-flex tw-justify-between">
          <ImpactLabel>☁️ CO2-eq stocké ou évité</ImpactLabel>
          <ImpactValue
            isTotal
            value={soilsStorageCO2eq + (impacts.avoidedCO2TonsWithEnergyProduction?.forecast ?? 0)}
            type="co2"
          />
        </div>
        <ImpactDetailRow
          onClick={() => {
            openImpactDescriptionModal("environmental-carbon-storage");
          }}
        >
          <ImpactDetailLabel>🍂 CO2-eq stocké dans les sols</ImpactDetailLabel>
          <ImpactValue value={soilsStorageCO2eq} type="co2" />
        </ImpactDetailRow>
        <ImpactDetailRow
          onClick={() => {
            openImpactDescriptionModal("environmental-avoided-co2-renewable-energy");
          }}
        >
          <ImpactDetailLabel>
            ⚡️ Émissions de CO2-eq évitées grâce à la production d'EnR
          </ImpactDetailLabel>
          <ImpactValue
            value={impacts.avoidedCO2TonsWithEnergyProduction?.forecast ?? 0}
            type="co2"
          />
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
          <ImpactValue
            isTotal
            value={impacts.permeableSurfaceArea.forecast - impacts.permeableSurfaceArea.base}
            type="surfaceArea"
          />
        </ImpactItemRow>
        <ImpactDetailRow
          onClick={() => {
            openImpactDescriptionModal("environmental-minerale-surface");
          }}
        >
          <ImpactDetailLabel>🪨 Surface perméable minérale</ImpactDetailLabel>
          <ImpactValue
            value={
              impacts.permeableSurfaceArea.mineralSoil.forecast -
              impacts.permeableSurfaceArea.mineralSoil.base
            }
            type="surfaceArea"
          />
        </ImpactDetailRow>
        <ImpactDetailRow
          onClick={() => {
            openImpactDescriptionModal("environmental-green-surface");
          }}
        >
          <ImpactDetailLabel>🌱 Surface perméable végétalisée</ImpactDetailLabel>
          <ImpactValue
            value={
              impacts.permeableSurfaceArea.greenSoil.forecast -
              impacts.permeableSurfaceArea.greenSoil.base
            }
            type="surfaceArea"
          />
        </ImpactDetailRow>
      </ImpactItemGroup>
    </section>
  );
};

export default EnvironmentalListSection;
