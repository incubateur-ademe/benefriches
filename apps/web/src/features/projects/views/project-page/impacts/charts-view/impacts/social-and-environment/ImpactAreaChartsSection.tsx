import { SoilType } from "shared";

import {
  EnvironmentalAreaChartImpactsData,
  SocialAreaChartImpactsData,
} from "@/features/projects/domain/projectImpactsAreaChartsData";
import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForSoilType } from "@/shared/core/soils";

import ImpactModalDescription, {
  ModalDataProps,
} from "../../../impact-description-modals/ImpactModalDescription";
import ImpactAreaChartCard from "../../ImpactChartCard/ImpactAreaChartCard";

type Props = {
  environmentalAreaChartImpactsData: EnvironmentalAreaChartImpactsData;
  socialAreaChartImpactsData: SocialAreaChartImpactsData;
  modalData: ModalDataProps;
};

const ImpactAreaChartsSection = ({
  environmentalAreaChartImpactsData,
  socialAreaChartImpactsData,
  modalData,
}: Props) => {
  const { fullTimeJobs, householdsPoweredByRenewableEnergy } = socialAreaChartImpactsData;
  const {
    nonContaminatedSurfaceArea,
    avoidedCo2eqEmissions,
    permeableSurfaceArea,
    soilsCarbonStorage,
  } = environmentalAreaChartImpactsData;

  return (
    <div className="tw-grid tw-gap-10 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-mb-8">
      {fullTimeJobs && (
        <>
          <ImpactModalDescription
            dialogId="fr-modal-impacts-etp-Chart"
            {...modalData}
            initialState={{
              sectionName: "social",
              impactName: "full_time_jobs",
            }}
          />
          <ImpactAreaChartCard
            dialogId="fr-modal-impacts-etp-Chart"
            type="etp"
            impact={{
              impactLabel: "🧑‍🔧️ Emplois équivalent temps plein",
              ...fullTimeJobs,
              details: [
                {
                  ...fullTimeJobs.operations,
                  impactLabel: "Exploitation du site",
                  color: "#C4D3DE",
                },
                {
                  ...fullTimeJobs.conversion,
                  impactLabel: "Reconversion du site",
                  color: "#D6BB1D",
                },
              ],
            }}
          />
        </>
      )}

      {householdsPoweredByRenewableEnergy && (
        <>
          <ImpactModalDescription
            dialogId="fr-modal-impacts-households_powered_by_renewable_energy-Chart"
            {...modalData}
            initialState={{
              sectionName: "social",
              impactName: "households_powered_by_renewable_energy",
            }}
          />
          <ImpactAreaChartCard
            dialogId="fr-modal-impacts-households_powered_by_renewable_energy-Chart"
            type="default"
            impact={{
              impactLabel: "🏠 Foyers alimentés par les énergies renouvelables",
              color: "#E3CFA9",
              ...householdsPoweredByRenewableEnergy,
            }}
          />
        </>
      )}

      {(() => {
        if (!soilsCarbonStorage) {
          return null;
        }
        const { base, forecast, difference, ...details } = soilsCarbonStorage;
        return (
          <>
            <ImpactAreaChartCard
              dialogId="fr-modal-impacts-soils_carbon_storage-Chart"
              type="co2"
              impact={{
                impactLabel: "🍂️ Carbone stocké dans les sols",
                base,
                forecast,
                difference,
                details: Object.entries(details).map(([type, value]) => ({
                  ...value,
                  impactLabel: getLabelForSoilType(type as SoilType),
                  color: getColorForSoilType(type as SoilType),
                })),
              }}
            />
            <ImpactModalDescription
              dialogId="fr-modal-impacts-soils_carbon_storage-Chart"
              {...modalData}
              initialState={{
                sectionName: "charts",
                impactName: "soils_carbon_storage",
              }}
            />
          </>
        );
      })()}

      {avoidedCo2eqEmissions && (
        <>
          <ImpactAreaChartCard
            dialogId="fr-modal-impacts-avoided_co2_emissions-Chart"
            type="co2"
            impact={{
              impactLabel: "☁️ CO2 eq stocké ou évité",
              ...avoidedCo2eqEmissions,
              details: [
                {
                  ...avoidedCo2eqEmissions.soilsCo2eqStorage,
                  impactLabel: "CO2-eq stocké dans les sols",
                  color: "#E6EA14",
                },
                {
                  ...avoidedCo2eqEmissions.withAirConditioningDiminution,
                  impactLabel: "Evitées grâce à l'utilisation réduite de de la climatisation",
                  color: "#14C3EA",
                },
                {
                  ...avoidedCo2eqEmissions.withCarTrafficDiminution,
                  impactLabel: "Evitées grâce aux déplacements en voiture évités",
                  color: "#14EA81",
                },
                {
                  ...avoidedCo2eqEmissions.withRenewableEnergyProduction,
                  impactLabel: "Évitées grâce à la production d'EnR",
                  color: "#149FEA",
                },
              ],
            }}
          />
          <ImpactModalDescription
            dialogId="fr-modal-impacts-avoided_co2_emissions-Chart"
            {...modalData}
            initialState={{
              sectionName: "environmental",
              impactName: "co2_benefit",
            }}
          />
        </>
      )}

      {permeableSurfaceArea && (
        <>
          <ImpactAreaChartCard
            dialogId="fr-modal-impacts-permeable_surface-Chart"
            type="surfaceArea"
            impact={{
              impactLabel: "🌧 Surface perméable",
              ...permeableSurfaceArea,
              details: [
                {
                  ...permeableSurfaceArea.greenSoil,
                  impactLabel: "Surface perméable végétalisée",
                  color: "#7ACA17",
                },
                {
                  ...permeableSurfaceArea.mineralSoil,
                  impactLabel: "Surface perméable minérale",
                  color: "#70706A",
                },
              ],
            }}
          />
          <ImpactModalDescription
            dialogId="fr-modal-impacts-permeable_surface-Chart"
            {...modalData}
            initialState={{
              sectionName: "environmental",
              impactName: "permeable_surface_area",
            }}
          />
        </>
      )}

      {nonContaminatedSurfaceArea && (
        <>
          <ImpactAreaChartCard
            dialogId="fr-modal-impacts-non_contaminated_surface-Chart"
            type="surfaceArea"
            impact={{
              impactLabel: "✨ Surface non polluée",
              color: "#FCDF3B",
              ...nonContaminatedSurfaceArea,
            }}
          />
          <ImpactModalDescription
            dialogId="fr-modal-impacts-non_contaminated_surface-Chart"
            {...modalData}
            initialState={{
              sectionName: "environmental",
              impactName: "non_contaminated_surface_area",
            }}
          />
        </>
      )}
    </div>
  );
};

export default ImpactAreaChartsSection;
