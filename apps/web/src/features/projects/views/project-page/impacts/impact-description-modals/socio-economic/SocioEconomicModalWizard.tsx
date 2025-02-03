import { useMemo } from "react";
import { sumListWithKey } from "shared";

import {
  getDetailedSocioEconomicProjectImpacts,
  SocioEconomicDetailsName,
  SocioEconomicImpactName,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ImpactInProgressDescriptionModal from "../ImpactInProgressDescriptionModal";
import { SocioEconomicSubSectionName } from "../ImpactModalDescriptionContext";
import { ImpactsData, ProjectData, SiteData } from "../ImpactModalDescriptionProvider";
import EconomicDirectDescription from "./EconomicDirectDescription";
import EconomicIndirectDescription from "./EconomicIndirectDescription";
import EnvironmentalMonetaryDescription from "./EnvironmentalMonetaryDescription";
import SocialMonetaryDescription from "./SocialMonetaryDescription";
import SocioEconomicDescription from "./SocioEconomicDescription";
import AvoidedAirPollutionDescription from "./avoided-air-pollution/AvoidedAirPollutionDescription";
import AvoidedCarRelatedExpensesDescription from "./avoided-car-related-expenses/AvoidedCarRelatedExpensesDescription";
import AirConditionningRelatedCo2MonetaryValueDescription from "./avoided-co2-monetary-value/AirConditionningRelatedCo2MonetaryValueDescription";
import AvoidedCo2MonetaryValueDescription from "./avoided-co2-monetary-value/AvoidedCo2MonetaryValueDescription";
import RenewableEnergyRelatedCo2MonetaryValueDescription from "./avoided-co2-monetary-value/RenewableEnergyRelatedCo2MonetaryValueDescription";
import TravelRelatedCo2MonetaryValueDescription from "./avoided-co2-monetary-value/TravelRelatedCo2MonetaryValueDescription";
import AvoidedFricheCostsDescription from "./avoided-friche-costs/AvoidedFricheCostsDescription";
import AvoidedIllegalDumpingCostsDescription from "./avoided-friche-costs/AvoidedIllegalDumpingCostsDescription";
import AvoidedOtherSecuringCostsDescription from "./avoided-friche-costs/AvoidedOtherSecuringCostsDescription";
import AvoidedSecurityCostsDescription from "./avoided-friche-costs/AvoidedSecurityCostsDescription";
import AvoidedPropertyDamagesExpenses from "./avoided-property-damages-expenses/AvoidedPropertyDamagesExpenses";
import AvoidedTrafficAccidentsDeathsMonetaryValueDescription from "./avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsDeathsDescription";
import AvoidedTrafficAccidentsMonetaryValueDescription from "./avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsDescription";
import AvoidedTrafficAccidentsMinorInjuriesMonetaryValueDescription from "./avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsMinorInjuries";
import AvoidedTrafficAccidentsSevereInjuriesMonetaryValueDescription from "./avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsSevereInjuriesDescription";
import { getSubSectionBreadcrumb, mainBreadcrumbSection } from "./breadcrumbSections";
import EcosystemServicesDescription from "./ecosystem-services/EcosystemServicesDescription";
import ForestRelatedProductDescription from "./ecosystem-services/ForestRelatedProductDescription";
import InvasiveSpeciesRegulationDescription from "./ecosystem-services/InvasiveSpeciesRegulationDescription";
import NatureRelatedWellnessAndLeisureDescription from "./ecosystem-services/NatureRelatedWellnessAndLeisureDescription";
import NitrogenCycleDescription from "./ecosystem-services/NitrogenCycleDescription";
import PollinationDescription from "./ecosystem-services/PollinationDescription";
import SoilErosionDescription from "./ecosystem-services/SoilErosionDescription";
import SoilsStorageRelatedCo2MonetaryValueDescription from "./ecosystem-services/SoilsStorageRelatedCo2MonetaryValueDescription";
import WaterCycle from "./ecosystem-services/WaterCycle";
import PropertyTransferDutiesIncreaseDescription from "./property-value-increase/PropertyTransferDutiesIncreaseDescription";
import PropertyValueIncreaseDescription from "./property-value-increase/PropertyValueIncreaseDescription";
import RentalIncomeDescription from "./rental-income/RentalIncomeDescription";
import RoadsAndUtilitiesMaintenanceExpenses from "./roads-and-utilities-maintenance-expenses/RoadsAndUtilitiesMaintenanceExpenses";
import TaxesIncomeDescription from "./taxes-income/TaxesIncomeDescription";
import TimeTravelSavedMonetaryValueDescription from "./time-travel-saved/TimeTravelSavedMonetaryValueDescription";
import WaterRegulationDescription from "./water-regulation/WaterRegulationDescription";

type Props = {
  impactName?: SocioEconomicMainImpactName;
  impactDetailsName?: SocioEconomicDetailsName;
  impactSubSectionName?: SocioEconomicSubSectionName;
  projectData: ProjectData;
  siteData: SiteData;
  impactsData: ImpactsData;
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
    .map(({ actor, amount, impact, details = [] }) => [
      { actor, amount, impact },
      ...details.map(({ impact, amount }) => ({ impact, amount, actor })),
    ])
    .flat()
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

  if (!impactName) {
    const impactsByCategory = getDetailedSocioEconomicProjectImpacts(impactsData);

    switch (impactSubSectionName) {
      case "economic_direct":
        return <EconomicDirectDescription impactsData={impactsByCategory.economicDirect} />;
      case "economic_indirect":
        return <EconomicIndirectDescription impactsData={impactsByCategory.economicIndirect} />;
      case "social_monetary":
        return <SocialMonetaryDescription impactsData={impactsByCategory.socialMonetary} />;
      case "environmental_monetary":
        return (
          <EnvironmentalMonetaryDescription impactsData={impactsByCategory.environmentalMonetary} />
        );
      case undefined:
        return <SocioEconomicDescription impactsData={impactsByCategory} />;
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
          impactData={getImpactData(impactsGroupedByName.taxes_income)}
        />
      );
    case "roads_and_utilities_maintenance_expenses":
      return (
        <RoadsAndUtilitiesMaintenanceExpenses
          surfaceArea={siteData.surfaceArea}
          impactData={getImpactData(impactsGroupedByName.roads_and_utilities_maintenance_expenses)}
        />
      );

    case "avoided_friche_costs":
      return (
        <AvoidedFricheCostsDescription
          impactData={sumListWithKey(impactsGroupedByName.avoided_friche_costs ?? [], "amount")}
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
          impactData={getImpactData(impactsGroupedByName.avoided_air_conditioning_co2_eq_emissions)}
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
      return <EcosystemServicesDescription impactsData={impactsData["socioeconomic"]["impacts"]} />;

    case "carbon_storage":
      return (
        <SoilsStorageRelatedCo2MonetaryValueDescription
          impactData={getImpactData(impactsGroupedByName.carbon_storage)}
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
          impactData={getImpactData(impactsGroupedByName.avoided_traffic_accidents)}
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
          openState: {
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
}
