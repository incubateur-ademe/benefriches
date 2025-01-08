import { useContext } from "react";
import { ReconversionProjectImpacts } from "shared";

import "./ImpactDescriptionModal.css";
import { ImpactModalDescriptionContext } from "./ImpactModalDescriptionContext";
import { ProjectData, SiteData } from "./ImpactModalDescriptionProvider";
import EconomicBalanceDescription from "./economic-balance/EconomicBalanceDescription";
import RealEstateAcquisitionDescription from "./economic-balance/real-estate-acquisition/RealEstateAcquisition";
import SiteReinstatementDescription from "./economic-balance/site-reinstatement/SiteReinstatementDescription";
import { EconomicBalanceImpactDescriptionModalId } from "./economic-balance/types";
import EnvironmentalMainDescription from "./environmental/EnvironmentalMainDescription";
import AvoidedCO2WithEnREnvironmentalDescription from "./environmental/impact-co2/AvoidedCO2WithEnREnvironmentalDescription";
import CarbonSoilsStorageEnvironmentalDescription from "./environmental/impact-co2/CarbonSoilsStorageEnvironmentalDescription";
import NonContaminatedSurfaceDescription from "./environmental/non-contaminated-surface/NonContaminatedSurface";
import PermeableGreenSurfaceDescription from "./environmental/permeable-surface/PermeableGreenSurface";
import PermeableMineraleSurfaceDescription from "./environmental/permeable-surface/PermeableMineraleSurface";
import PermeableSurfaceDescription from "./environmental/permeable-surface/PermeableSurface";
import { EnvironmentalImpactDescriptionModalId } from "./environmental/types";
import SocialMainDescription from "./social/SocialMainDescription";
import AvoidedVehiculeKilometersDescription from "./social/avoided-vehicule-kilometers/AvoidedVehiculeKilometersDescription";
import FullTimeJobsDescription from "./social/full-time-jobs/FullTimeJobsDescription";
import PhotovoltaicOperationFullTimeJobsDescription from "./social/full-time-jobs/PhotovoltaicOperationFullTimeJobsDescription";
import ReconversionFullTimeJobsDescription from "./social/full-time-jobs/ReconversionFullTimeJobsDescription";
import UrbanProjectOperationFullTimeJobsDescription from "./social/full-time-jobs/UrbanProjectOperationFullTimeJobsDescription";
import HouseholdsPoweredByRenewableEnergyDescription from "./social/householdsPoweredByEnR/householdsPoweredByEnR";
import TimeTravelSavedDescription from "./social/time-travel-saved/TimeTravelSavedDescription";
import { SocialImpactDescriptionModalId } from "./social/types";
import SocioEconomicDescription from "./socio-economic/SocioEconomicDescription";
import AvoidedCO2WithEnRMonetaryValueDescription from "./socio-economic/avoided-co2-monetary-value/AvoidedCo2WithRenewableEnergyMonetaryValueDescription";
import AvoidedFricheCostsDescription from "./socio-economic/avoided-friche-costs/AvoidedFricheCostsDescription";
import AvoidedIllegalDumpingCostsDescription from "./socio-economic/avoided-friche-costs/AvoidedIllegalDumpingCostsDescription";
import AvoidedOtherSecuringCostsDescription from "./socio-economic/avoided-friche-costs/AvoidedOtherSecuringCostsDescription";
import AvoidedSecurityCostsDescription from "./socio-economic/avoided-friche-costs/AvoidedSecurityCostsDescription";
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
import { SocioEconomicImpactDescriptionModalId } from "./socio-economic/types";
import WaterRegulationDescription from "./socio-economic/water-regulation/WaterRegulationDescription";

export type ImpactDescriptionModalCategory =
  | EconomicBalanceImpactDescriptionModalId
  | SocioEconomicImpactDescriptionModalId
  | SocialImpactDescriptionModalId
  | EnvironmentalImpactDescriptionModalId
  | undefined;

type Props = {
  projectData: ProjectData;
  siteData: SiteData;
  impactsData: ReconversionProjectImpacts;
};

export function ImpactDescriptionModalWizard({ projectData, siteData, impactsData }: Props) {
  const { openState } = useContext(ImpactModalDescriptionContext);

  switch (openState) {
    case "economic-balance":
      return <EconomicBalanceDescription />;

    case "economic-balance.site-reinstatement":
      return <SiteReinstatementDescription />;

    case "economic-balance.real-estate-acquisition":
      return <RealEstateAcquisitionDescription />;

    case "socio-economic":
      return <SocioEconomicDescription />;

    case "socio-economic.rental-income":
      return <RentalIncomeDescription developmentPlan={projectData.developmentPlan} />;

    case "socio-economic.taxes-income":
      return <TaxesIncomeDescription developmentPlan={projectData.developmentPlan} />;
    case "socio-economic.roads-and-utilities-maintenance-expenses":
      return <RoadsAndUtilitiesMaintenanceExpenses surfaceArea={siteData.surfaceArea} />;

    case "socio-economic.avoided-friche-costs":
      return <AvoidedFricheCostsDescription />;

    case "socio-economic.avoided-illegal-dumping-costs":
      return <AvoidedIllegalDumpingCostsDescription addressLabel={siteData.addressLabel} />;
    case "socio-economic.avoided-security-costs":
      return <AvoidedSecurityCostsDescription siteSurfaceArea={siteData.surfaceArea} />;

    case "socio-economic.avoided-other-securing-costs":
      return <AvoidedOtherSecuringCostsDescription />;

    case "socio-economic.property-value-increase":
      return <PropertyValueIncreaseDescription siteSurfaceArea={siteData.surfaceArea} />;
    case "socio-economic.property-transfer-duties-increase":
      return <PropertyTransferDutiesIncreaseDescription />;
    case "socio-economic.avoided-co2-renewable-energy":
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

    case "socio-economic.water-regulation":
      return (
        <WaterRegulationDescription
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
          baseContaminatedSurface={siteData.contaminatedSoilSurface}
          forecastContaminatedSurface={projectData.contaminatedSoilSurface}
        />
      );

    case "socio-economic.ecosystem-services":
      return <EcosystemServicesDescription impactsData={impactsData} />;

    case "socio-economic.ecosystem-services.carbon-storage":
      return (
        <CarbonSoilsStorageMonetaryValueDescription
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
        />
      );

    case "socio-economic.ecosystem-services.nature-related-wellness-and-leisure":
      return (
        <NatureRelatedWellnessAndLeisureDescription
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
        />
      );
    case "socio-economic.ecosystem-services.forest-related-product":
      return (
        <NatureRelatedWellnessAndLeisureDescription
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
        />
      );

    case "socio-economic.ecosystem-services.invasive-species-regulation":
      return (
        <InvasiveSpeciesRegulationDescription
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
        />
      );
    case "socio-economic.ecosystem-services.nitrogen-cycle":
      return (
        <NitrogenCycleDescription
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
        />
      );
    case "socio-economic.ecosystem-services.pollinisation":
      return (
        <PollinationDescription
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
        />
      );
    case "socio-economic.ecosystem-services.soil-erosion":
      return (
        <SoilErosionDescription
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
        />
      );
    case "socio-economic.ecosystem-services.water-cycle":
      return (
        <WaterCycle
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
        />
      );

    case "social":
      return <SocialMainDescription />;
    case "social.full-time-jobs":
      return <FullTimeJobsDescription />;
    case "social.full-time-reconversion-jobs":
      return (
        <ReconversionFullTimeJobsDescription
          isPhotovoltaic={projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"}
        />
      );
    case "social.full-time-operation-jobs":
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
    case "social.households-powered-by-renewable-energy":
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

    case "social.avoided-vehicule-kilometers":
      return <AvoidedVehiculeKilometersDescription />;
    case "social.time-travel-saved":
      return <TimeTravelSavedDescription />;

    case "environmental":
      return <EnvironmentalMainDescription />;

    case "environmental.avoided-co2-renewable-energy": {
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

    case "environmental.carbon-storage":
      return (
        <CarbonSoilsStorageEnvironmentalDescription
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
        />
      );
    case "environmental.non-contamined-surface":
      return <NonContaminatedSurfaceDescription />;

    case "environmental.permeable-surface":
      return <PermeableSurfaceDescription />;

    case "environmental.minerale-surface":
      return <PermeableMineraleSurfaceDescription />;

    case "environmental.green-surface":
      return <PermeableGreenSurfaceDescription />;
  }
}
