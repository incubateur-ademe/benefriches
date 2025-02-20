import {
  SocialImpactDetailsName,
  SocialMainImpactName,
} from "@/features/projects/domain/projectImpactsSocial";

import { getSocialImpactLabel } from "../../getImpactLabel";
import ImpactInProgressDescriptionModal from "../ImpactInProgressDescriptionModal";
import { SocialSubSectionName } from "../ImpactModalDescriptionContext";
import { ImpactsData, ProjectData, SiteData } from "../ImpactModalDescriptionProvider";
import JobsSubSectionDescription from "./JobsSubSectionDescription";
import SocialMainDescription from "./SocialMainDescription";
import AvoidedTrafficAccidentsDeathsDescription from "./avoided-traffic-accidents/AvoidedTrafficAccidentsDeathsDescription";
import AvoidedTrafficAccidentsDescription from "./avoided-traffic-accidents/AvoidedTrafficAccidentsDescription";
import AvoidedTrafficAccidentsMinorInjuriesDescription from "./avoided-traffic-accidents/AvoidedTrafficAccidentsMinorInjuries";
import AvoidedTrafficAccidentsSevereInjuriesDescription from "./avoided-traffic-accidents/AvoidedTrafficAccidentsSevereInjuriesDescription";
import AvoidedVehiculeKilometersDescription from "./avoided-vehicule-kilometers/AvoidedVehiculeKilometersDescription";
import {
  frenchSocietyBreadcrumbSection,
  getSubSectionBreadcrumb,
  localPeopleBreadcrumbSection,
  mainBreadcrumbSection,
} from "./breadcrumbSections";
import FullTimeJobsDescription from "./full-time-jobs/FullTimeJobsDescription";
import PhotovoltaicOperationFullTimeJobsDescription from "./full-time-jobs/PhotovoltaicOperationFullTimeJobsDescription";
import ReconversionFullTimeJobsDescription from "./full-time-jobs/ReconversionFullTimeJobsDescription";
import UrbanProjectOperationFullTimeJobsDescription from "./full-time-jobs/UrbanProjectOperationFullTimeJobsDescription";
import HouseholdsPoweredByRenewableEnergyDescription from "./householdsPoweredByEnR/householdsPoweredByEnR";
import TimeTravelSavedDescription from "./time-travel-saved/TimeTravelSavedDescription";

type Props = {
  impactName?: SocialMainImpactName;
  impactDetailsName?: SocialImpactDetailsName;
  impactSubSectionName?: SocialSubSectionName;
  projectData: ProjectData;
  siteData: SiteData;
  impactsData: ImpactsData;
};

export function SocialModalWizard({
  impactName,
  impactDetailsName,
  impactSubSectionName,
  projectData,
  siteData,
  impactsData,
}: Props) {
  if (!impactName) {
    switch (impactSubSectionName) {
      case "french_society":
        return (
          <ImpactInProgressDescriptionModal
            title={frenchSocietyBreadcrumbSection.label}
            breadcrumbProps={{
              section: mainBreadcrumbSection,
            }}
          />
        );
      case "jobs":
        return <JobsSubSectionDescription />;
      case "local_people":
        return (
          <ImpactInProgressDescriptionModal
            title={localPeopleBreadcrumbSection.label}
            breadcrumbProps={{
              section: mainBreadcrumbSection,
            }}
          />
        );
      case undefined:
        return <SocialMainDescription />;
    }
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
            projectData.developmentPlan.buildingsFloorAreaDistribution.LOCAL_STORE ?? 0
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
      return (
        <AvoidedVehiculeKilometersDescription
          impactData={impactsData.social.avoidedVehiculeKilometers}
        />
      );
    case "travel_time_saved":
      return <TimeTravelSavedDescription impactData={impactsData.social.travelTimeSaved} />;

    case "avoided_traffic_accidents":
      return (
        <AvoidedTrafficAccidentsDescription
          impactData={impactsData.social.avoidedTrafficAccidents}
        />
      );
    case "avoided_traffic_severe_injuries":
      return (
        <AvoidedTrafficAccidentsSevereInjuriesDescription
          impactData={impactsData.social.avoidedTrafficAccidents?.severeInjuries}
        />
      );
    case "avoided_traffic_minor_injuries":
      return (
        <AvoidedTrafficAccidentsMinorInjuriesDescription
          impactData={impactsData.social.avoidedTrafficAccidents?.minorInjuries}
        />
      );
    case "avoided_traffic_deaths":
      return (
        <AvoidedTrafficAccidentsDeathsDescription
          impactData={impactsData.social.avoidedTrafficAccidents?.deaths}
        />
      );

    default: {
      const subSectionSegments = impactSubSectionName && [
        getSubSectionBreadcrumb(impactSubSectionName),
      ];
      const impactNameSegments = impactDetailsName && [
        {
          label: getSocialImpactLabel(impactName),
          openState: {
            sectionName: "social" as const,
            subSectionName: impactSubSectionName,
            impactName,
          },
        },
      ];
      return (
        <ImpactInProgressDescriptionModal
          title={getSocialImpactLabel(impactDetailsName ?? impactName)}
          breadcrumbProps={{
            section: mainBreadcrumbSection,
            segments: [...(subSectionSegments ?? []), ...(impactNameSegments ?? [])],
          }}
        />
      );
    }
  }
}
