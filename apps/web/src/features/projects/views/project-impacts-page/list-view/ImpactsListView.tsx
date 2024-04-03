import { ReconversionProjectImpacts } from "../../../domain/impacts.types";
import {
  formatCO2Impact,
  formatDefaultImpact,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
} from "./formatImpactValue";
import ImpactDetailLabel from "./ImpactDetailLabel";
import ImpactDetailRow from "./ImpactItemDetailRow";
import ImpactItemGroup from "./ImpactItemGroup";
import ImpactItemRow from "./ImpactItemRow";
import ImpactLabel from "./ImpactLabel";
import ImpactSectionTitle from "./ImpactSectionTitle";
import ImpactValue from "./ImpactValue";
import SocioEconomicImpactsListSection from "./SocioEconomicSection";

type Props = {
  project: {
    name: string;
  };
  impacts: ReconversionProjectImpacts;
};

const ImpactsListView = ({ impacts }: Props) => {
  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <section className="fr-mb-5w">
        <h3>Analyse coûts bénéfices</h3>
        <ImpactItemRow>
          <ImpactLabel>📉 Bilan de l’opération</ImpactLabel>
          <ImpactValue>{formatMonetaryImpact(impacts.economicBalance.total)}</ImpactValue>
        </ImpactItemRow>
        <ImpactItemRow>
          <ImpactLabel>🌎 Impacts socio-économiques</ImpactLabel>
          <ImpactValue>{formatMonetaryImpact(impacts.socioeconomic.total)}</ImpactValue>
        </ImpactItemRow>
      </section>
      <section className="fr-mb-5w">
        <h3>Bilan de l’opération</h3>
        {!!impacts.economicBalance.costs.realEstateTransaction && (
          <ImpactItemRow>
            <ImpactLabel>🏠 Acquisition du site</ImpactLabel>
            <ImpactValue>
              {formatMonetaryImpact(impacts.economicBalance.costs.realEstateTransaction)}
            </ImpactValue>
          </ImpactItemRow>
        )}
        {!!impacts.economicBalance.costs.siteReinstatement && (
          <ImpactItemRow>
            <ImpactLabel>🏗 Remise en état de la friche</ImpactLabel>
            <ImpactValue>
              {formatMonetaryImpact(impacts.economicBalance.costs.siteReinstatement)}
            </ImpactValue>
          </ImpactItemRow>
        )}
        {!!impacts.economicBalance.costs.developmentPlanInstallation && (
          <ImpactItemRow>
            <ImpactLabel>⚡️ Installation des panneaux photovoltaïques</ImpactLabel>
            <ImpactValue>
              {formatMonetaryImpact(impacts.economicBalance.costs.developmentPlanInstallation)}
            </ImpactValue>
          </ImpactItemRow>
        )}
        {!!impacts.economicBalance.revenues.financialAssistance && (
          <ImpactItemRow>
            <ImpactLabel>🏦 Aides financières</ImpactLabel>
            <ImpactValue>
              {formatMonetaryImpact(impacts.economicBalance.revenues.financialAssistance)}
            </ImpactValue>
          </ImpactItemRow>
        )}
        <ImpactItemRow>
          <ImpactLabel>💸️ Charges d’exploitation</ImpactLabel>
          <ImpactValue>
            {formatMonetaryImpact(impacts.economicBalance.costs.operationsCosts.total)}
          </ImpactValue>
        </ImpactItemRow>
        <ImpactItemRow>
          <ImpactLabel>💰 Recettes d’exploitation</ImpactLabel>
          <ImpactValue>
            {formatMonetaryImpact(impacts.economicBalance.revenues.operationsRevenues.total)}
          </ImpactValue>
        </ImpactItemRow>
        <ImpactItemRow>
          <ImpactLabel>Total du bilan de l’opération</ImpactLabel>
          <ImpactValue isTotal>{formatMonetaryImpact(impacts.economicBalance.total)}</ImpactValue>
        </ImpactItemRow>
      </section>
      <SocioEconomicImpactsListSection socioEconomicImpacts={impacts.socioeconomic.impacts} />
      <section className="fr-mb-5w">
        <h3>Impacts environnementaux</h3>
        {impacts.nonContaminatedSurfaceArea && (
          <ImpactItemRow>
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
                impacts.soilsCarbonStorage.forecast.total -
                  impacts.soilsCarbonStorage.current.total +
                  (impacts.avoidedCO2TonsWithEnergyProduction?.forecast ?? 0),
              )}
            </ImpactValue>
          </div>
          <ImpactDetailRow>
            <ImpactDetailLabel>🍂 Carbone stocké dans les sols</ImpactDetailLabel>
            <ImpactValue>
              {formatCO2Impact(
                impacts.soilsCarbonStorage.forecast.total -
                  impacts.soilsCarbonStorage.current.total,
              )}
            </ImpactValue>
          </ImpactDetailRow>
          <ImpactDetailRow>
            <ImpactDetailLabel>
              ⚡️ Émissions de CO2-eq évitées grâce à la production d'EnR
            </ImpactDetailLabel>
            <ImpactValue>
              {formatCO2Impact(impacts.avoidedCO2TonsWithEnergyProduction?.forecast ?? 0)}
            </ImpactValue>
          </ImpactDetailRow>
        </ImpactItemGroup>
        <ImpactItemGroup>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ImpactLabel>🌧 Surface perméable</ImpactLabel>
            <ImpactValue isTotal>
              {formatSurfaceAreaImpact(
                impacts.permeableSurfaceArea.forecast - impacts.permeableSurfaceArea.base,
              )}
            </ImpactValue>
          </div>
          <ImpactDetailRow>
            <ImpactDetailLabel>🪨 Surface perméable minérale</ImpactDetailLabel>
            <ImpactValue>
              {formatSurfaceAreaImpact(
                impacts.permeableSurfaceArea.mineralSoil.forecast -
                  impacts.permeableSurfaceArea.mineralSoil.base,
              )}
            </ImpactValue>
          </ImpactDetailRow>
          <ImpactDetailRow>
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
      <section>
        <h3>Impacts sociaux</h3>
        <ImpactSectionTitle>Impacts sur l’emploi</ImpactSectionTitle>
        <ImpactItemGroup>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ImpactLabel>🧑‍🔧 Emplois équivalent temps plein mobilisés</ImpactLabel>
            <ImpactValue isTotal>
              {formatDefaultImpact(impacts.fullTimeJobs.forecast - impacts.fullTimeJobs.current)}
            </ImpactValue>
          </div>
          <ImpactDetailRow>
            <ImpactDetailLabel>👷 Reconversion du site</ImpactDetailLabel>
            <ImpactValue>
              {formatDefaultImpact(
                impacts.fullTimeJobs.conversion.forecast - impacts.fullTimeJobs.conversion.current,
              )}
            </ImpactValue>
          </ImpactDetailRow>
          <ImpactDetailRow>
            <ImpactDetailLabel>🧑‍🔧 Exploitation du site</ImpactDetailLabel>
            <ImpactValue>
              {formatDefaultImpact(
                impacts.fullTimeJobs.operations.forecast - impacts.fullTimeJobs.operations.current,
              )}
            </ImpactValue>
          </ImpactDetailRow>
        </ImpactItemGroup>

        {impacts.accidents && (
          <>
            <ImpactSectionTitle>Impacts sur les riverains</ImpactSectionTitle>
            <ImpactItemGroup>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <ImpactLabel>🤕 Accidents évités sur la friche</ImpactLabel>
                <ImpactValue isTotal>
                  {formatDefaultImpact(impacts.accidents.current, { withSignPrefix: false })}
                </ImpactValue>
              </div>
              <ImpactDetailRow>
                <ImpactDetailLabel>💥 Blessés légers évités</ImpactDetailLabel>
                <ImpactValue>
                  {formatDefaultImpact(impacts.accidents.minorInjuries.current, {
                    withSignPrefix: false,
                  })}
                </ImpactValue>
              </ImpactDetailRow>
              <ImpactDetailRow>
                <ImpactDetailLabel>🚑 Blessés graves évités</ImpactDetailLabel>
                <ImpactValue>
                  {formatDefaultImpact(impacts.accidents.severeInjuries.current, {
                    withSignPrefix: false,
                  })}
                </ImpactValue>
              </ImpactDetailRow>
            </ImpactItemGroup>
          </>
        )}
        {impacts.householdsPoweredByRenewableEnergy && (
          <>
            <ImpactSectionTitle>Impacts sur la société française</ImpactSectionTitle>
            <ImpactItemRow>
              <ImpactLabel>🏠 Foyers alimentés par les EnR</ImpactLabel>
              <ImpactValue isTotal>
                {formatDefaultImpact(impacts.householdsPoweredByRenewableEnergy.forecast, {
                  withSignPrefix: false,
                })}
              </ImpactValue>
            </ImpactItemRow>
          </>
        )}
      </section>
    </div>
  );
};

export default ImpactsListView;
