import { lazy, Suspense, useMemo } from "react";
import { sumListWithKey } from "shared";

import {
  SocioEconomicDetailsName,
  SocioEconomicImpactName,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import ImpactInProgressDescriptionModal from "@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal";
import { SocioEconomicSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import { ModalDataProps } from "../ImpactModalDescription";
import { getSubSectionBreadcrumb, mainBreadcrumbSection } from "./breadcrumbSections";

const SocioEconomicDescription = lazy(() => import("./SocioEconomicDescription"));
const EconomicDirectDescription = lazy(() => import("./EconomicDirectDescription"));
const EconomicIndirectDescription = lazy(() => import("./EconomicIndirectDescription"));
const EnvironmentalMonetaryDescription = lazy(() => import("./EnvironmentalMonetaryDescription"));
const SocialMonetaryDescription = lazy(() => import("./SocialMonetaryDescription"));
const AvoidedAirConditionningExpensesDescription = lazy(
  () => import("./avoided-air-conditionning-expenses/AvoidedAirConditionningExpensesDescription"),
);
const AvoidedAirPollutionDescription = lazy(
  () => import("./avoided-air-pollution/AvoidedAirPollutionDescription"),
);
const AvoidedCarRelatedExpensesDescription = lazy(
  () => import("./avoided-car-related-expenses/AvoidedCarRelatedExpensesDescription"),
);
const AirConditionningRelatedCo2MonetaryValueDescription = lazy(
  () => import("./avoided-co2-monetary-value/AirConditionningRelatedCo2MonetaryValueDescription"),
);
const AvoidedCo2MonetaryValueDescription = lazy(
  () => import("./avoided-co2-monetary-value/AvoidedCo2MonetaryValueDescription"),
);
const RenewableEnergyRelatedCo2MonetaryValueDescription = lazy(
  () => import("./avoided-co2-monetary-value/RenewableEnergyRelatedCo2MonetaryValueDescription"),
);
const TravelRelatedCo2MonetaryValueDescription = lazy(
  () => import("./avoided-co2-monetary-value/TravelRelatedCo2MonetaryValueDescription"),
);
const AvoidedFricheCostsDescription = lazy(
  () => import("./avoided-friche-costs/AvoidedFricheCostsDescription"),
);
const AvoidedIllegalDumpingCostsDescription = lazy(
  () => import("./avoided-friche-costs/AvoidedIllegalDumpingCostsDescription"),
);
const AvoidedOtherSecuringCostsDescription = lazy(
  () => import("./avoided-friche-costs/AvoidedOtherSecuringCostsDescription"),
);
const AvoidedSecurityCostsDescription = lazy(
  () => import("./avoided-friche-costs/AvoidedSecurityCostsDescription"),
);
const AvoidedPropertyDamagesExpenses = lazy(
  () => import("./avoided-property-damages-expenses/AvoidedPropertyDamagesExpenses"),
);
const AvoidedTrafficAccidentsDeathsMonetaryValueDescription = lazy(
  () =>
    import("./avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsDeathsDescription"),
);
const AvoidedTrafficAccidentsMonetaryValueDescription = lazy(
  () => import("./avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsDescription"),
);
const AvoidedTrafficAccidentsMinorInjuriesMonetaryValueDescription = lazy(
  () => import("./avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsMinorInjuries"),
);
const AvoidedTrafficAccidentsSevereInjuriesMonetaryValueDescription = lazy(
  () =>
    import(
      "./avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsSevereInjuriesDescription"
    ),
);
const EcosystemServicesDescription = lazy(
  () => import("./ecosystem-services/EcosystemServicesDescription"),
);
const ForestRelatedProductDescription = lazy(
  () => import("./ecosystem-services/ForestRelatedProductDescription"),
);
const InvasiveSpeciesRegulationDescription = lazy(
  () => import("./ecosystem-services/InvasiveSpeciesRegulationDescription"),
);
const NatureRelatedWellnessAndLeisureDescription = lazy(
  () => import("./ecosystem-services/NatureRelatedWellnessAndLeisureDescription"),
);
const NitrogenCycleDescription = lazy(
  () => import("./ecosystem-services/NitrogenCycleDescription"),
);
const PollinationDescription = lazy(() => import("./ecosystem-services/PollinationDescription"));
const SoilErosionDescription = lazy(() => import("./ecosystem-services/SoilErosionDescription"));
const SoilsStorageRelatedCo2MonetaryValueDescription = lazy(
  () => import("./ecosystem-services/SoilsStorageRelatedCo2MonetaryValueDescription"),
);
const WaterCycle = lazy(() => import("./ecosystem-services/WaterCycle"));
const PropertyTransferDutiesIncreaseDescription = lazy(
  () => import("./property-value-increase/PropertyTransferDutiesIncreaseDescription"),
);
const PropertyValueIncreaseDescription = lazy(
  () => import("./property-value-increase/PropertyValueIncreaseDescription"),
);
const RentalIncomeDescription = lazy(() => import("./rental-income/RentalIncomeDescription"));
const RoadsAndUtilitiesMaintenanceExpenses = lazy(
  () => import("./roads-and-utilities-maintenance-expenses/RoadsAndUtilitiesMaintenanceExpenses"),
);
const TaxesIncomeDescription = lazy(() => import("./taxes-income/TaxesIncomeDescription"));
const TimeTravelSavedMonetaryValueDescription = lazy(
  () => import("./time-travel-saved/TimeTravelSavedMonetaryValueDescription"),
);
const WaterRegulationDescription = lazy(
  () => import("./water-regulation/WaterRegulationDescription"),
);

type Props = {
  impactName?: SocioEconomicMainImpactName;
  impactDetailsName?: SocioEconomicDetailsName;
  impactSubSectionName?: SocioEconomicSubSectionName;
  projectData: ModalDataProps["projectData"];
  siteData: ModalDataProps["siteData"];
  impactsData: ModalDataProps["impactsData"];
};

type GetImpactsGroupedByNameProps = {
  impact: SocioEconomicMainImpactName;
  actor: string;
  amount: number;
  details?: {
    amount: number;
    impact: SocioEconomicDetailsName;
  }[];
}[];

type ImpactActorList = { actor: string; amount: number }[];
type ImpactsGroupedByName = Partial<Record<SocioEconomicImpactName, ImpactActorList>>;

const groupByImpactName = (impacts: GetImpactsGroupedByNameProps): ImpactsGroupedByName => {
  return impacts
    .flatMap(({ actor, amount, impact, details = [] }) => [
      { actor, amount, impact },
      ...details.map(({ impact, amount }) => ({ impact, amount, actor })),
    ])
    .reduce<ImpactsGroupedByName>(
      (byImpactName, { impact, actor, amount }) => ({
        ...byImpactName,
        [impact]: byImpactName[impact]
          ? [...byImpactName[impact], { actor, amount }]
          : [{ actor, amount }],
      }),
      {},
    );
};

const getImpactData = (actors?: ImpactActorList) => {
  if (!actors) {
    return undefined;
  }
  if (actors.length === 1) {
    return actors[0]?.amount;
  }
};

export function SocioEconomicModalWizard({
  impactName,
  impactDetailsName,
  impactSubSectionName,
  projectData,
  siteData,
  impactsData,
}: Props) {
  const impactsGroupedByName = useMemo(
    () => groupByImpactName(impactsData.socioeconomic.impacts),
    [impactsData.socioeconomic.impacts],
  );

  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      {(() => {
        if (!impactName) {
          switch (impactSubSectionName) {
            case "economic_direct":
              return (
                <EconomicDirectDescription
                  impactsData={impactsData.socioeconomic.impacts.filter(
                    ({ impactCategory }) => impactCategory === "economic_direct",
                  )}
                />
              );
            case "economic_indirect":
              return (
                <EconomicIndirectDescription
                  impactsData={impactsData.socioeconomic.impacts.filter(
                    ({ impactCategory }) => impactCategory === "economic_indirect",
                  )}
                />
              );
            case "social_monetary":
              return (
                <SocialMonetaryDescription
                  impactsData={impactsData.socioeconomic.impacts.filter(
                    ({ impactCategory }) => impactCategory === "social_monetary",
                  )}
                />
              );
            case "environmental_monetary":
              return (
                <EnvironmentalMonetaryDescription
                  impactsData={impactsData.socioeconomic.impacts.filter(
                    ({ impactCategory }) => impactCategory === "environmental_monetary",
                  )}
                />
              );
            case undefined:
              return <SocioEconomicDescription impactsData={impactsData} />;
          }
        }

        switch (impactDetailsName ?? impactName) {
          case "rental_income":
            return (
              <RentalIncomeDescription
                developmentPlan={projectData.developmentPlan}
                impactData={sumListWithKey(impactsGroupedByName.rental_income ?? [], "amount")}
              />
            );

          case "taxes_income":
            return (
              <TaxesIncomeDescription
                developmentPlan={projectData.developmentPlan}
                impactData={impactsData["socioeconomic"]["impacts"].find(
                  (impact) => impact.impact === "taxes_income",
                )}
              />
            );
          case "roads_and_utilities_maintenance_expenses":
            return (
              <RoadsAndUtilitiesMaintenanceExpenses
                surfaceArea={siteData.surfaceArea}
                impactData={getImpactData(
                  impactsGroupedByName.roads_and_utilities_maintenance_expenses,
                )}
              />
            );

          case "avoided_friche_costs":
            return (
              <AvoidedFricheCostsDescription
                impactData={impactsData["socioeconomic"].impacts.filter(
                  (impact) => impact.impact === "avoided_friche_costs",
                )}
              />
            );

          case "avoided_illegal_dumping_costs":
            return (
              <AvoidedIllegalDumpingCostsDescription
                addressLabel={siteData.addressLabel}
                impactData={getImpactData(impactsGroupedByName.avoided_illegal_dumping_costs)}
              />
            );
          case "avoided_security_costs":
            return (
              <AvoidedSecurityCostsDescription
                siteSurfaceArea={siteData.surfaceArea}
                impactData={getImpactData(impactsGroupedByName.avoided_security_costs)}
              />
            );

          case "avoided_other_securing_costs":
            return (
              <AvoidedOtherSecuringCostsDescription
                impactData={getImpactData(impactsGroupedByName.avoided_other_securing_costs)}
              />
            );

          case "local_property_value_increase":
            return (
              <PropertyValueIncreaseDescription
                siteSurfaceArea={siteData.surfaceArea}
                impactData={getImpactData(impactsGroupedByName.local_property_value_increase)}
              />
            );
          case "local_transfer_duties_increase":
            return (
              <PropertyTransferDutiesIncreaseDescription
                impactData={getImpactData(impactsGroupedByName.property_transfer_duties_income)}
              />
            );

          case "avoided_property_damages_expenses":
            return (
              <AvoidedPropertyDamagesExpenses
                impactData={getImpactData(impactsGroupedByName.avoided_property_damages_expenses)}
              />
            );

          case "avoided_air_conditioning_expenses":
            return (
              <AvoidedAirConditionningExpensesDescription
                impactData={sumListWithKey(
                  impactsGroupedByName.avoided_air_conditioning_expenses ?? [],
                  "amount",
                )}
              />
            );

          case "avoided_co2_eq_emissions":
            return <AvoidedCo2MonetaryValueDescription impactsData={impactsData} />;

          case "avoided_co2_eq_with_enr":
            return (
              <RenewableEnergyRelatedCo2MonetaryValueDescription
                impactData={getImpactData(impactsGroupedByName.avoided_co2_eq_with_enr)}
                projectData={
                  projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                    ? projectData.developmentPlan
                    : undefined
                }
                siteData={{ address: siteData.addressLabel }}
              />
            );

          case "avoided_traffic_co2_eq_emissions":
            return (
              <TravelRelatedCo2MonetaryValueDescription
                impactData={getImpactData(impactsGroupedByName.avoided_traffic_co2_eq_emissions)}
              />
            );

          case "avoided_air_conditioning_co2_eq_emissions":
            return (
              <AirConditionningRelatedCo2MonetaryValueDescription
                impactData={getImpactData(
                  impactsGroupedByName.avoided_air_conditioning_co2_eq_emissions,
                )}
              />
            );

          case "water_regulation":
            return (
              <WaterRegulationDescription
                impactData={getImpactData(impactsGroupedByName.water_regulation)}
                baseSoilsDistribution={siteData.soilsDistribution}
                forecastSoilsDistribution={projectData.soilsDistribution}
                baseContaminatedSurface={siteData.contaminatedSoilSurface}
                forecastContaminatedSurface={projectData.contaminatedSoilSurface}
              />
            );

          case "ecosystem_services":
            return (
              <EcosystemServicesDescription impactsData={impactsData["socioeconomic"]["impacts"]} />
            );

          case "soils_co2_eq_storage":
            return (
              <SoilsStorageRelatedCo2MonetaryValueDescription
                impactData={getImpactData(impactsGroupedByName.soils_co2_eq_storage)}
                baseSoilsDistribution={siteData.soilsDistribution}
                forecastSoilsDistribution={projectData.soilsDistribution}
              />
            );

          case "nature_related_wellness_and_leisure":
            return (
              <NatureRelatedWellnessAndLeisureDescription
                impactData={getImpactData(impactsGroupedByName.nature_related_wellness_and_leisure)}
                baseSoilsDistribution={siteData.soilsDistribution}
                forecastSoilsDistribution={projectData.soilsDistribution}
              />
            );
          case "forest_related_product":
            return (
              <ForestRelatedProductDescription
                impactData={getImpactData(impactsGroupedByName.forest_related_product)}
                baseSoilsDistribution={siteData.soilsDistribution}
                forecastSoilsDistribution={projectData.soilsDistribution}
              />
            );

          case "invasive_species_regulation":
            return (
              <InvasiveSpeciesRegulationDescription
                impactData={getImpactData(impactsGroupedByName.invasive_species_regulation)}
                baseSoilsDistribution={siteData.soilsDistribution}
                forecastSoilsDistribution={projectData.soilsDistribution}
              />
            );
          case "nitrogen_cycle":
            return (
              <NitrogenCycleDescription
                impactData={getImpactData(impactsGroupedByName.nitrogen_cycle)}
                baseSoilsDistribution={siteData.soilsDistribution}
                forecastSoilsDistribution={projectData.soilsDistribution}
              />
            );
          case "pollination":
            return (
              <PollinationDescription
                impactData={getImpactData(impactsGroupedByName.pollination)}
                baseSoilsDistribution={siteData.soilsDistribution}
                forecastSoilsDistribution={projectData.soilsDistribution}
              />
            );
          case "soil_erosion":
            return (
              <SoilErosionDescription
                impactData={getImpactData(impactsGroupedByName.soil_erosion)}
                baseSoilsDistribution={siteData.soilsDistribution}
                forecastSoilsDistribution={projectData.soilsDistribution}
              />
            );
          case "water_cycle":
            return (
              <WaterCycle
                impactData={getImpactData(impactsGroupedByName.water_cycle)}
                baseSoilsDistribution={siteData.soilsDistribution}
                forecastSoilsDistribution={projectData.soilsDistribution}
              />
            );

          case "travel_time_saved":
            return (
              <TimeTravelSavedMonetaryValueDescription
                impactData={getImpactData(impactsGroupedByName.travel_time_saved)}
              />
            );

          case "avoided_car_related_expenses":
            return (
              <AvoidedCarRelatedExpensesDescription
                impactData={getImpactData(impactsGroupedByName.avoided_car_related_expenses)}
              />
            );

          case "avoided_air_pollution":
            return (
              <AvoidedAirPollutionDescription
                impactData={getImpactData(impactsGroupedByName.avoided_air_pollution)}
              />
            );

          case "avoided_traffic_accidents":
            return (
              <AvoidedTrafficAccidentsMonetaryValueDescription
                impactData={impactsData["socioeconomic"]["impacts"].find(
                  (impact) => impact.impact === "avoided_traffic_accidents",
                )}
              />
            );
          case "avoided_traffic_minor_injuries":
            return (
              <AvoidedTrafficAccidentsMinorInjuriesMonetaryValueDescription
                impactData={getImpactData(impactsGroupedByName.avoided_traffic_minor_injuries)}
              />
            );
          case "avoided_traffic_severe_injuries":
            return (
              <AvoidedTrafficAccidentsSevereInjuriesMonetaryValueDescription
                impactData={getImpactData(impactsGroupedByName.avoided_traffic_minor_injuries)}
              />
            );

          case "avoided_traffic_deaths":
            return (
              <AvoidedTrafficAccidentsDeathsMonetaryValueDescription
                impactData={getImpactData(impactsGroupedByName.avoided_traffic_deaths)}
              />
            );

          default: {
            const subSectionSegments = impactSubSectionName && [
              getSubSectionBreadcrumb(impactSubSectionName),
            ];
            const impactNameSegments = impactDetailsName && [
              {
                label: getSocioEconomicImpactLabel(impactName),
                contentState: {
                  sectionName: "socio_economic" as const,
                  subSectionName: impactSubSectionName,
                  impactName,
                },
              },
            ];
            return (
              <ImpactInProgressDescriptionModal
                title={getSocioEconomicImpactLabel(impactDetailsName ?? impactName)}
                breadcrumbProps={{
                  section: mainBreadcrumbSection,
                  segments: [...(subSectionSegments ?? []), ...(impactNameSegments ?? [])],
                }}
              />
            );
          }
        }
      })()}
    </Suspense>
  );
}
