import {
  EnvironmentalImpactDetailsName,
  EnvironmentalMainImpactName,
} from "@/features/projects/domain/projectImpactsEnvironmental";

import {
  getEnvironmentalDetailsImpactLabel,
  getEnvironmentalImpactLabel,
} from "../../getImpactLabel";
import ImpactInProgressDescriptionModal from "../ImpactInProgressDescriptionModal";
import { EnvironmentSubSectionName } from "../ImpactModalDescriptionContext";
import { ImpactsData, ProjectData, SiteData } from "../ImpactModalDescriptionProvider";
import Co2SubSectionDescription from "./Co2SubSectionDescription";
import EnvironmentalMainDescription from "./EnvironmentalMainDescription";
import {
  getSubSectionBreadcrumb,
  mainBreadcrumbSection,
  soilsBreadcrumbSection,
} from "./breadcrumbSections";
import AirConditionningRelatedCo2Description from "./impact-co2/AirConditionningRelatedCo2Description";
import Co2EqEmissionsDescription from "./impact-co2/Co2EqEmissionsDescription";
import RenewableEnergyRelatedCo2Description from "./impact-co2/RenewableEnergyRelatedCo2Description";
import SoilsStorageRelatedCo2Description from "./impact-co2/SoilsStorageRelatedCo2Description";
import TravelRelatedCo2Description from "./impact-co2/TravelRelatedCo2Description";
import NonContaminatedSurfaceDescription from "./non-contaminated-surface/NonContaminatedSurface";
import PermeableGreenSurfaceDescription from "./permeable-surface/PermeableGreenSurface";
import PermeableMineraleSurfaceDescription from "./permeable-surface/PermeableMineraleSurface";
import PermeableSurfaceDescription from "./permeable-surface/PermeableSurface";

type Props = {
  impactName?: EnvironmentalMainImpactName;
  impactDetailsName?: EnvironmentalImpactDetailsName;
  impactSubSectionName?: EnvironmentSubSectionName;
  projectData: ProjectData;
  siteData: SiteData;
  impactsData: ImpactsData;
};

export function EnvironmentalModalWizard({
  impactName,
  impactDetailsName,
  impactSubSectionName,
  projectData,
  siteData,
  impactsData,
}: Props) {
  if (!impactName) {
    switch (impactSubSectionName) {
      case "co2":
        return <Co2SubSectionDescription />;
      case "soils":
        return (
          <ImpactInProgressDescriptionModal
            title={soilsBreadcrumbSection.label}
            breadcrumbProps={{
              section: mainBreadcrumbSection,
            }}
          />
        );
      case undefined:
        return <EnvironmentalMainDescription />;
    }
  }

  switch (impactDetailsName ?? impactName) {
    case "co2_benefit":
      return <Co2EqEmissionsDescription impactsData={impactsData} />;
    case "avoided_car_traffic_co2_eq_emissions":
      return (
        <TravelRelatedCo2Description
          impactData={impactsData.environmental.avoidedCarTrafficCo2EqEmissions}
        />
      );
    case "avoided_co2_eq_emissions_with_production":
      return (
        <RenewableEnergyRelatedCo2Description
          siteData={{ address: siteData.addressLabel }}
          impactData={impactsData.environmental.avoidedCO2TonsWithEnergyProduction?.forecast}
          projectData={
            projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
              ? projectData.developmentPlan
              : undefined
          }
        />
      );

    case "stored_co2_eq":
      return (
        <SoilsStorageRelatedCo2Description
          baseSoilsDistribution={siteData.soilsDistribution}
          forecastSoilsDistribution={projectData.soilsDistribution}
          impactData={impactsData.environmental.soilsCarbonStorage}
        />
      );

    case "avoided_air_conditioning_co2_eq_emissions":
      return (
        <AirConditionningRelatedCo2Description
          impactData={impactsData.environmental.avoidedAirConditioningCo2EqEmissions}
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

    default: {
      const subSectionSegments = impactSubSectionName && [
        getSubSectionBreadcrumb(impactSubSectionName),
      ];
      const impactNameSegments = impactDetailsName && [
        {
          label: getEnvironmentalImpactLabel(impactName),
          openState: {
            sectionName: "environmental" as const,
            subSectionName: impactSubSectionName,
            impactName,
          },
        },
      ];
      return (
        <ImpactInProgressDescriptionModal
          title={
            impactDetailsName
              ? getEnvironmentalDetailsImpactLabel(impactName, impactDetailsName)
              : getEnvironmentalImpactLabel(impactName)
          }
          breadcrumbProps={{
            section: mainBreadcrumbSection,
            segments: [...(subSectionSegments ?? []), ...(impactNameSegments ?? [])],
          }}
        />
      );
    }
  }
}
