import {
  EnvironmentalImpactDetailsName,
  EnvironmentalMainImpactName,
  getEnvironmentalProjectImpacts,
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
import AvoidedCO2WithEnREnvironmentalDescription from "./impact-co2/AvoidedCO2WithEnREnvironmentalDescription";
import CarbonSoilsStorageEnvironmentalDescription from "./impact-co2/CarbonSoilsStorageEnvironmentalDescription";
import Co2BenefitDescription from "./impact-co2/Co2BenefitDescription";
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
  const environmentalImpacts = getEnvironmentalProjectImpacts(impactsData);

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
      return <Co2BenefitDescription impactsData={environmentalImpacts} />;
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

    case "stored_co2_eq":
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
