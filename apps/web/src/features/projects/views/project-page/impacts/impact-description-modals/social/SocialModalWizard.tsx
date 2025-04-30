import { lazy, Suspense } from "react";

import {
  SocialImpactDetailsName,
  SocialMainImpactName,
} from "@/features/projects/domain/projectImpactsSocial";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { getSocialImpactLabel } from "../../getImpactLabel";
import { ModalDataProps } from "../ImpactModalDescription";
import { SocialSubSectionName } from "../ImpactModalDescriptionContext";
import {
  frenchSocietyBreadcrumbSection,
  getSubSectionBreadcrumb,
  localPeopleBreadcrumbSection,
  mainBreadcrumbSection,
} from "./breadcrumbSections";

const ImpactInProgressDescriptionModal = lazy(() => import("../ImpactInProgressDescriptionModal"));
const JobsSubSectionDescription = lazy(() => import("./JobsSubSectionDescription"));
const SocialMainDescription = lazy(() => import("./SocialMainDescription"));
const AvoidedTrafficAccidentsDeathsDescription = lazy(
  () => import("./avoided-traffic-accidents/AvoidedTrafficAccidentsDeathsDescription"),
);
const AvoidedTrafficAccidentsDescription = lazy(
  () => import("./avoided-traffic-accidents/AvoidedTrafficAccidentsDescription"),
);
const AvoidedTrafficAccidentsMinorInjuriesDescription = lazy(
  () => import("./avoided-traffic-accidents/AvoidedTrafficAccidentsMinorInjuries"),
);
const AvoidedTrafficAccidentsSevereInjuriesDescription = lazy(
  () => import("./avoided-traffic-accidents/AvoidedTrafficAccidentsSevereInjuriesDescription"),
);
const AvoidedVehiculeKilometersDescription = lazy(
  () => import("./avoided-vehicule-kilometers/AvoidedVehiculeKilometersDescription"),
);
const FullTimeJobsDescription = lazy(() => import("./full-time-jobs/FullTimeJobsDescription"));
const PhotovoltaicOperationFullTimeJobsDescription = lazy(
  () => import("./full-time-jobs/PhotovoltaicOperationFullTimeJobsDescription"),
);
const ReconversionFullTimeJobsDescription = lazy(
  () => import("./full-time-jobs/ReconversionFullTimeJobsDescription"),
);
const UrbanProjectOperationFullTimeJobsDescription = lazy(
  () => import("./full-time-jobs/UrbanProjectOperationFullTimeJobsDescription"),
);
const HouseholdsPoweredByRenewableEnergyDescription = lazy(
  () => import("./householdsPoweredByEnR/householdsPoweredByEnR"),
);
const TimeTravelSavedDescription = lazy(
  () => import("./time-travel-saved/TimeTravelSavedDescription"),
);

type Props = {
  impactName?: SocialMainImpactName;
  impactDetailsName?: SocialImpactDetailsName;
  impactSubSectionName?: SocialSubSectionName;
  projectData: ModalDataProps["projectData"];
  siteData: ModalDataProps["siteData"];
  impactsData: ModalDataProps["impactsData"];
};

export function SocialModalWizard({
  impactName,
  impactDetailsName,
  impactSubSectionName,
  projectData,
  siteData,
  impactsData,
}: Props) {
  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "tw-text-grey-light" }} />}>
      {(() => {
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
      })()}
    </Suspense>
  );
}
