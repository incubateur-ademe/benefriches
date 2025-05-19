import { SoilType } from "shared";

import {
  EnvironmentalAreaChartImpactsData,
  SocialAreaChartImpactsData,
} from "@/features/projects/domain/projectImpactsAreaChartsData";
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

const getMaxColor = (
  impacts: {
    color: string;
    value: number;
  }[],
) => {
  const max = impacts.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0];

  if (max) {
    return max.color;
  }
  return undefined;
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
    <div className="tw-grid tw-gap-x-8 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3">
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
            title="🧑‍🔧️ Emplois équivalent temps plein"
            color={getMaxColor([
              {
                value: fullTimeJobs.operations.difference,
                color: "#C4D3DE",
              },
              {
                value: fullTimeJobs.conversion.difference,
                color: "#D6BB1D",
              },
            ])}
            base={fullTimeJobs.base}
            forecast={fullTimeJobs.forecast}
            difference={fullTimeJobs.difference}
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
            title="🏠 Foyers alimentés par les énergies renouvelables"
            color="#E3CFA9"
            base={householdsPoweredByRenewableEnergy.base}
            forecast={householdsPoweredByRenewableEnergy.forecast}
            difference={householdsPoweredByRenewableEnergy.difference}
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
              title="🍂️ Carbone stocké dans les sols"
              base={base}
              forecast={forecast}
              difference={difference}
              color={getMaxColor(
                Object.entries(details).map(([type, value]) => ({
                  value: value.difference,
                  color: getColorForSoilType(type as SoilType),
                })),
              )}
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
            title="☁️ CO2 eq stocké ou évité"
            base={avoidedCo2eqEmissions.base}
            forecast={avoidedCo2eqEmissions.forecast}
            difference={avoidedCo2eqEmissions.difference}
            color={getMaxColor([
              {
                value:
                  avoidedCo2eqEmissions.soilsCo2eqStorage.forecast -
                  avoidedCo2eqEmissions.soilsCo2eqStorage.base,
                color: "#E6EA14",
              },
              {
                value:
                  avoidedCo2eqEmissions.withAirConditioningDiminution.forecast -
                  avoidedCo2eqEmissions.withAirConditioningDiminution.base,
                color: "#14C3EA",
              },
              {
                value:
                  avoidedCo2eqEmissions.withCarTrafficDiminution.forecast -
                  avoidedCo2eqEmissions.withCarTrafficDiminution.base,
                color: "#14EA81",
              },
              {
                value:
                  avoidedCo2eqEmissions.withRenewableEnergyProduction.forecast -
                  avoidedCo2eqEmissions.withRenewableEnergyProduction.base,
                color: "#149FEA",
              },
            ])}
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
            base={permeableSurfaceArea.base}
            forecast={permeableSurfaceArea.forecast}
            difference={permeableSurfaceArea.difference}
            title="🌧 Surface perméable"
            color={getMaxColor([
              {
                value: permeableSurfaceArea.greenSoil.difference,
                color: "#7ACA17",
              },
              {
                value: permeableSurfaceArea.mineralSoil.difference,
                color: "#70706A",
              },
            ])}
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
            title="✨ Surface non polluée"
            color="#FCDF3B"
            base={nonContaminatedSurfaceArea.base}
            forecast={nonContaminatedSurfaceArea.forecast}
            difference={nonContaminatedSurfaceArea.difference}
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
