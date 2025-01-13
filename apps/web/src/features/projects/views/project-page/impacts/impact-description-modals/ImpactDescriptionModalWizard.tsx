import { useContext } from "react";
import { ReconversionProjectImpacts } from "shared";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
  getEnvironmentalDetailsImpactLabel,
  getEnvironmentalImpactLabel,
  getSocialImpactLabel,
  getSocioEconomicImpactLabel,
} from "../getImpactLabel";
import "./ImpactDescriptionModal.css";
import ImpactInProgressDescriptionModal from "./ImpactInProgressDescriptionModal";
import { ImpactModalDescriptionContext } from "./ImpactModalDescriptionContext";
import { ProjectData, SiteData } from "./ImpactModalDescriptionProvider";
import EconomicBalanceDescription from "./economic-balance/EconomicBalanceDescription";
import { breadcrumbSection as economicBalanceBreadcrumbSection } from "./economic-balance/breadcrumbSection";
import RealEstateAcquisitionDescription from "./economic-balance/real-estate-acquisition/RealEstateAcquisition";
import SiteReinstatementDescription from "./economic-balance/site-reinstatement/SiteReinstatementDescription";
import EnvironmentalMainDescription from "./environmental/EnvironmentalMainDescription";
import { breadcrumbSection as environmentalBreadcrumbSection } from "./environmental/breadcrumbSection";
import AvoidedCO2WithEnREnvironmentalDescription from "./environmental/impact-co2/AvoidedCO2WithEnREnvironmentalDescription";
import CarbonSoilsStorageEnvironmentalDescription from "./environmental/impact-co2/CarbonSoilsStorageEnvironmentalDescription";
import NonContaminatedSurfaceDescription from "./environmental/non-contaminated-surface/NonContaminatedSurface";
import PermeableGreenSurfaceDescription from "./environmental/permeable-surface/PermeableGreenSurface";
import PermeableMineraleSurfaceDescription from "./environmental/permeable-surface/PermeableMineraleSurface";
import PermeableSurfaceDescription from "./environmental/permeable-surface/PermeableSurface";
import SocialMainDescription from "./social/SocialMainDescription";
import AvoidedVehiculeKilometersDescription from "./social/avoided-vehicule-kilometers/AvoidedVehiculeKilometersDescription";
import { breadcrumbSection as socialBreadcrumbSection } from "./social/breadcrumbSection";
import FullTimeJobsDescription from "./social/full-time-jobs/FullTimeJobsDescription";
import PhotovoltaicOperationFullTimeJobsDescription from "./social/full-time-jobs/PhotovoltaicOperationFullTimeJobsDescription";
import ReconversionFullTimeJobsDescription from "./social/full-time-jobs/ReconversionFullTimeJobsDescription";
import UrbanProjectOperationFullTimeJobsDescription from "./social/full-time-jobs/UrbanProjectOperationFullTimeJobsDescription";
import HouseholdsPoweredByRenewableEnergyDescription from "./social/householdsPoweredByEnR/householdsPoweredByEnR";
import TimeTravelSavedDescription from "./social/time-travel-saved/TimeTravelSavedDescription";
import SocioEconomicDescription from "./socio-economic/SocioEconomicDescription";
import AvoidedCO2WithEnRMonetaryValueDescription from "./socio-economic/avoided-co2-monetary-value/AvoidedCo2WithRenewableEnergyMonetaryValueDescription";
import AvoidedFricheCostsDescription from "./socio-economic/avoided-friche-costs/AvoidedFricheCostsDescription";
import AvoidedIllegalDumpingCostsDescription from "./socio-economic/avoided-friche-costs/AvoidedIllegalDumpingCostsDescription";
import AvoidedOtherSecuringCostsDescription from "./socio-economic/avoided-friche-costs/AvoidedOtherSecuringCostsDescription";
import AvoidedSecurityCostsDescription from "./socio-economic/avoided-friche-costs/AvoidedSecurityCostsDescription";
import { breadcrumbSection as socioEconomicBreadcrumbSection } from "./socio-economic/breadcrumbSection";
import CarbonSoilsStorageMonetaryValueDescription from "./socio-economic/ecosystem-services/CarbonStorageMonetaryValueDescription";
import EcosystemServicesDescription from "./socio-economic/ecosystem-services/EcosystemServicesDescription";
import InvasiveSpeciesRegulationDescription from "./socio-economic/ecosystem-services/InvasiveSpeciesRegulationDescription";
import NatureRelatedWellnessAndLeisureDescription from "./socio-economic/ecosystem-services/NatureRelatedWellnessAndLeisureDescription";
import NitrogenCycleDescription from "./socio-economic/ecosystem-services/NitrogenCycleDescription";
import PollinationDescription from "./socio-economic/ecosystem-services/PollinationDescription";
import SoilErosionDescription from "./socio-economic/ecosystem-services/SoilErosionDescription";
import WaterCycle from "./socio-economic/ecosystem-services/WaterCycle";
import PropertyTransferDutiesIncreaseDescription from "./socio-economic/property-value-increase/PropertyTransferDutiesIncreaseDescription";
import PropertyValueIncreaseDescription from "./socio-economic/property-value-increase/PropertyValueIncreaseDescription";
import RentalIncomeDescription from "./socio-economic/rental-income/RentalIncomeDescription";
import RoadsAndUtilitiesMaintenanceExpenses from "./socio-economic/roads-and-utilities-maintenance-expenses/RoadsAndUtilitiesMaintenanceExpenses";
import TaxesIncomeDescription from "./socio-economic/taxes-income/TaxesIncomeDescription";
import WaterRegulationDescription from "./socio-economic/water-regulation/WaterRegulationDescription";

type Props = {
  projectData: ProjectData;
  siteData: SiteData;
  impactsData: ReconversionProjectImpacts;
};

export function ImpactDescriptionModalWizard({ projectData, siteData, impactsData }: Props) {
  const { openState } = useContext(ImpactModalDescriptionContext);

  const { sectionName, impactName, impactDetailsName } = openState;

  if (!sectionName) {
    return undefined;
  }

  if (sectionName === "economic_balance") {
    if (!impactName) {
      return <EconomicBalanceDescription />;
    }

    switch (impactDetailsName ?? impactName) {
      case "site_reinstatement":
        return <SiteReinstatementDescription />;

      case "site_purchase":
        return <RealEstateAcquisitionDescription />;

      default:
        return (
          <ImpactInProgressDescriptionModal
            title={
              impactDetailsName
                ? getEconomicBalanceDetailsImpactLabel(impactName, impactDetailsName)
                : getEconomicBalanceImpactLabel(impactName)
            }
            breadcrumbProps={{
              section: economicBalanceBreadcrumbSection,
              segments: impactDetailsName && [
                {
                  label: getEconomicBalanceImpactLabel(impactName),
                  openState: { sectionName, impactName },
                },
              ],
            }}
          />
        );
    }
  }

  if (sectionName === "socio_economic") {
    if (!impactName) {
      return <SocioEconomicDescription />;
    }

    switch (impactDetailsName ?? impactName) {
      case "rental_income":
        return <RentalIncomeDescription developmentPlan={projectData.developmentPlan} />;

      case "taxes_income":
        return <TaxesIncomeDescription developmentPlan={projectData.developmentPlan} />;
      case "roads_and_utilities_maintenance_expenses":
        return <RoadsAndUtilitiesMaintenanceExpenses surfaceArea={siteData.surfaceArea} />;

      case "avoided_friche_costs":
        return <AvoidedFricheCostsDescription />;

      case "avoided_illegal_dumping_costs":
        return <AvoidedIllegalDumpingCostsDescription addressLabel={siteData.addressLabel} />;
      case "avoided_security_costs":
        return <AvoidedSecurityCostsDescription siteSurfaceArea={siteData.surfaceArea} />;

      case "avoided_other_securing_costs":
        return <AvoidedOtherSecuringCostsDescription />;

      case "local_property_value_increase":
        return <PropertyValueIncreaseDescription siteSurfaceArea={siteData.surfaceArea} />;
      case "property_transfer_duties_income":
        return <PropertyTransferDutiesIncreaseDescription />;
      case "avoided_co2_eq_with_enr":
        return (
          <AvoidedCO2WithEnRMonetaryValueDescription
            address={siteData.addressLabel}
            developmentPlanElectricalPowerKWc={
              projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                ? projectData.developmentPlan.electricalPowerKWc
                : undefined
            }
            developmentPlanSurfaceArea={
              projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                ? projectData.developmentPlan.surfaceArea
                : undefined
            }
          />
        );

      case "water_regulation":
        return (
          <WaterRegulationDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
            baseContaminatedSurface={siteData.contaminatedSoilSurface}
            forecastContaminatedSurface={projectData.contaminatedSoilSurface}
          />
        );

      case "ecosystem_services":
        return <EcosystemServicesDescription impactsData={impactsData} />;

      case "carbon_storage":
        return (
          <CarbonSoilsStorageMonetaryValueDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        );

      case "nature_related_wellness_and_leisure":
        return (
          <NatureRelatedWellnessAndLeisureDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        );
      case "forest_related_product":
        return (
          <NatureRelatedWellnessAndLeisureDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        );

      case "invasive_species_regulation":
        return (
          <InvasiveSpeciesRegulationDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        );
      case "nitrogen_cycle":
        return (
          <NitrogenCycleDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        );
      case "pollination":
        return (
          <PollinationDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        );
      case "soil_erosion":
        return (
          <SoilErosionDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        );
      case "water_cycle":
        return (
          <WaterCycle
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        );

      default:
        return (
          <ImpactInProgressDescriptionModal
            title={getSocioEconomicImpactLabel(impactName)}
            breadcrumbProps={{
              section: socioEconomicBreadcrumbSection,
              segments: impactDetailsName && [
                {
                  label: getSocioEconomicImpactLabel(impactName),
                  openState: { sectionName, impactName },
                },
              ],
            }}
          />
        );
    }
  }

  if (sectionName === "social") {
    if (!impactName) {
      return <SocialMainDescription />;
    }

    switch (impactDetailsName ?? impactName) {
      case "full_time_jobs":
        return <FullTimeJobsDescription />;
      case "conversion_full_time_jobs":
        return (
          <ReconversionFullTimeJobsDescription
            isPhotovoltaic={projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"}
          />
        );
      case "operations_full_time_jobs":
        return projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" ? (
          <PhotovoltaicOperationFullTimeJobsDescription
            electricalPowerKWc={projectData.developmentPlan.electricalPowerKWc}
          />
        ) : (
          <UrbanProjectOperationFullTimeJobsDescription
            groundFloorRetailSurface={
              projectData.developmentPlan.buildingsFloorAreaDistribution.GROUND_FLOOR_RETAIL ?? 0
            }
          />
        );
      case "households_powered_by_renewable_energy":
        return (
          <HouseholdsPoweredByRenewableEnergyDescription
            address={siteData.addressLabel}
            developmentPlanElectricalPowerKWc={
              projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                ? projectData.developmentPlan.electricalPowerKWc
                : undefined
            }
            developmentPlanSurfaceArea={
              projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                ? projectData.developmentPlan.surfaceArea
                : undefined
            }
          />
        );

      case "avoided_vehicule_kilometers":
        return <AvoidedVehiculeKilometersDescription />;
      case "travel_time_saved":
        return <TimeTravelSavedDescription />;

      default:
        return (
          <ImpactInProgressDescriptionModal
            title={getSocialImpactLabel(impactName)}
            breadcrumbProps={{
              section: socialBreadcrumbSection,
              segments: impactDetailsName && [
                {
                  label: getSocialImpactLabel(impactName),
                  openState: { sectionName, impactName },
                },
              ],
            }}
          />
        );
    }
  }

  if (!impactName) {
    return <EnvironmentalMainDescription />;
  }

  switch (impactDetailsName ?? impactName) {
    case "avoided_co2_eq_emissions_with_production": {
      const surfaceArea =
        projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
          ? projectData.developmentPlan.surfaceArea
          : undefined;
      const electricalPowerKWc =
        projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
          ? projectData.developmentPlan.electricalPowerKWc
          : undefined;
      return (
        <AvoidedCO2WithEnREnvironmentalDescription
          address={siteData.addressLabel}
          developmentPlanElectricalPowerKWc={electricalPowerKWc}
          developmentPlanSurfaceArea={surfaceArea}
        />
      );
    }

    case "soils_carbon_storage":
      return (
        <CarbonSoilsStorageEnvironmentalDescription
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
        />
      );
    case "non_contaminated_surface_area":
      return <NonContaminatedSurfaceDescription />;

    case "permeable_surface_area":
      return <PermeableSurfaceDescription />;

    case "mineral_soil":
      return <PermeableMineraleSurfaceDescription />;

    case "green_soil":
      return <PermeableGreenSurfaceDescription />;

    default:
      return (
        <ImpactInProgressDescriptionModal
          title={
            impactDetailsName
              ? getEnvironmentalDetailsImpactLabel(impactName, impactDetailsName)
              : getEnvironmentalImpactLabel(impactName)
          }
          breadcrumbProps={{
            section: environmentalBreadcrumbSection,
            segments: impactDetailsName && [
              {
                label: getEnvironmentalImpactLabel(impactName),
                openState: { sectionName, impactName },
              },
            ],
          }}
        />
      );
  }
}
