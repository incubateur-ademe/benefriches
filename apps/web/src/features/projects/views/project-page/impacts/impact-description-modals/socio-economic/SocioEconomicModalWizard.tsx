import {
  SocioEconomicDetailsName,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ImpactInProgressDescriptionModal from "../ImpactInProgressDescriptionModal";
import { SocioEconomicSubSectionName } from "../ImpactModalDescriptionContext";
import { ImpactsData, ProjectData, SiteData } from "../ImpactModalDescriptionProvider";
import SocioEconomicDescription from "./SocioEconomicDescription";
import AvoidedCO2WithEnRMonetaryValueDescription from "./avoided-co2-monetary-value/AvoidedCo2WithRenewableEnergyMonetaryValueDescription";
import AvoidedFricheCostsDescription from "./avoided-friche-costs/AvoidedFricheCostsDescription";
import AvoidedIllegalDumpingCostsDescription from "./avoided-friche-costs/AvoidedIllegalDumpingCostsDescription";
import AvoidedOtherSecuringCostsDescription from "./avoided-friche-costs/AvoidedOtherSecuringCostsDescription";
import AvoidedSecurityCostsDescription from "./avoided-friche-costs/AvoidedSecurityCostsDescription";
import { getSubSectionBreadcrumb, mainBreadcrumbSection } from "./breadcrumbSections";
import CarbonSoilsStorageMonetaryValueDescription from "./ecosystem-services/CarbonStorageMonetaryValueDescription";
import EcosystemServicesDescription from "./ecosystem-services/EcosystemServicesDescription";
import InvasiveSpeciesRegulationDescription from "./ecosystem-services/InvasiveSpeciesRegulationDescription";
import NatureRelatedWellnessAndLeisureDescription from "./ecosystem-services/NatureRelatedWellnessAndLeisureDescription";
import NitrogenCycleDescription from "./ecosystem-services/NitrogenCycleDescription";
import PollinationDescription from "./ecosystem-services/PollinationDescription";
import SoilErosionDescription from "./ecosystem-services/SoilErosionDescription";
import WaterCycle from "./ecosystem-services/WaterCycle";
import PropertyTransferDutiesIncreaseDescription from "./property-value-increase/PropertyTransferDutiesIncreaseDescription";
import PropertyValueIncreaseDescription from "./property-value-increase/PropertyValueIncreaseDescription";
import RentalIncomeDescription from "./rental-income/RentalIncomeDescription";
import RoadsAndUtilitiesMaintenanceExpenses from "./roads-and-utilities-maintenance-expenses/RoadsAndUtilitiesMaintenanceExpenses";
import TaxesIncomeDescription from "./taxes-income/TaxesIncomeDescription";
import WaterRegulationDescription from "./water-regulation/WaterRegulationDescription";

type Props = {
  impactName?: SocioEconomicMainImpactName;
  impactDetailsName?: SocioEconomicDetailsName;
  impactSubSectionName?: SocioEconomicSubSectionName;
  projectData: ProjectData;
  siteData: SiteData;
  impactsData: ImpactsData;
};

export function SocioEconomicModalWizard({
  impactName,
  impactDetailsName,
  impactSubSectionName,
  projectData,
  siteData,
  impactsData,
}: Props) {
  if (!impactName) {
    switch (impactSubSectionName) {
      case "economic_direct":
        return (
          <ImpactInProgressDescriptionModal
            title="Impacts économiques directs"
            breadcrumbProps={{
              section: mainBreadcrumbSection,
            }}
          />
        );
      case "economic_indirect":
        return (
          <ImpactInProgressDescriptionModal
            title="Impacts économiques indirects"
            breadcrumbProps={{
              section: mainBreadcrumbSection,
            }}
          />
        );
      case "social_monetary":
        return (
          <ImpactInProgressDescriptionModal
            title="Impacts sociaux monétarisés"
            breadcrumbProps={{
              section: mainBreadcrumbSection,
            }}
          />
        );
      case "environmental_monetary":
        return (
          <ImpactInProgressDescriptionModal
            title="Impacts environnementaux monétarisés"
            breadcrumbProps={{
              section: mainBreadcrumbSection,
            }}
          />
        );
      case undefined:
        return <SocioEconomicDescription impactsData={impactsData} />;
    }
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
      return <EcosystemServicesDescription impactsData={impactsData["socioeconomic"]["impacts"]} />;

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
