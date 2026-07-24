import { lazy, Suspense } from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import {
  getSocialProjectImpacts,
  SocialImpactDetailsName,
  SocialMainImpactName,
} from "@/features/projects/domain/projectImpactsSocial";
import { SocialSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { getSocialImpactLabel } from "../../getImpactLabel";
import {
  frenchSocietyBreadcrumbSection,
  getSubSectionBreadcrumb,
  localPeopleBreadcrumbSection,
  mainBreadcrumbSection,
} from "./breadcrumbSections";

const ImpactInProgressDescriptionModal = lazy(
  () => import("@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal"),
);
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
  contextData: ModalDataProps["contextData"];
  impactsData: ModalDataProps["impactsData"];
};

export function SocialModalWizard({
  impactName,
  impactDetailsName,
  impactSubSectionName,
  contextData,
  impactsData,
}: Props) {
  const socialImpacts = getSocialProjectImpacts(impactsData);

  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
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
            return (
              <FullTimeJobsDescription
                impactData={socialImpacts.find((item) => item.name === "full_time_jobs")}
              />
            );
          case "conversion_full_time_jobs":
            return (
              <ReconversionFullTimeJobsDescription
                isPhotovoltaic={
                  contextData.projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                }
              />
            );
          case "operations_full_time_jobs":
            return contextData.projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" ? (
              <PhotovoltaicOperationFullTimeJobsDescription
                electricalPowerKWc={
                  contextData.projectDevelopmentPlan.installationElectricalPowerKWc
                }
              />
            ) : (
              <UrbanProjectOperationFullTimeJobsDescription
                groundFloorRetailSurface={
                  contextData.projectDevelopmentPlan.buildingsFloorAreaDistribution.LOCAL_STORE ?? 0
                }
              />
            );
          case "households_powered_by_renewable_energy":
            return (
              <HouseholdsPoweredByRenewableEnergyDescription
                address={contextData.siteAddress.label}
                developmentPlanElectricalPowerKWc={
                  contextData.projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                    ? contextData.projectDevelopmentPlan.installationElectricalPowerKWc
                    : undefined
                }
                developmentPlanSurfaceArea={
                  contextData.projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                    ? contextData.projectDevelopmentPlan.installationSurfaceArea
                    : undefined
                }
                impactData={
                  impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
                    (item) => item.name === "householdsPoweredByRenewableEnergy",
                  )?.total ?? 0
                }
              />
            );

          case "avoided_vehicule_kilometers":
            return (
              <AvoidedVehiculeKilometersDescription
                impactData={
                  impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
                    (item) => item.name === "avoidedVehiculeKilometers",
                  )?.total ?? 0
                }
              />
            );
          case "travel_time_saved":
            return (
              <TimeTravelSavedDescription
                impactData={
                  impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
                    (item) => item.name === "timeTravelSavedInHours",
                  )?.total ?? 0
                }
              />
            );

          case "avoided_traffic_accidents":
            return (
              <AvoidedTrafficAccidentsDescription
                impactData={impactsData?.aggregatedReconversionImpacts.impactsMetrics.filter(
                  (item) =>
                    item.name === "avoidedTrafficAccidentsDeaths" ||
                    item.name === "avoidedTrafficAccidentsSevereInjuries" ||
                    item.name === "avoidedTrafficAccidentsMinorInjuries",
                )}
              />
            );
          case "avoided_traffic_severe_injuries":
            return (
              <AvoidedTrafficAccidentsSevereInjuriesDescription
                impactData={
                  impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
                    (item) => item.name === "avoidedTrafficAccidentsSevereInjuries",
                  )?.total ?? 0
                }
              />
            );
          case "avoided_traffic_minor_injuries":
            return (
              <AvoidedTrafficAccidentsMinorInjuriesDescription
                impactData={
                  impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
                    (item) => item.name === "avoidedTrafficAccidentsMinorInjuries",
                  )?.total ?? 0
                }
              />
            );
          case "avoided_traffic_deaths":
            return (
              <AvoidedTrafficAccidentsDeathsDescription
                impactData={
                  impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
                    (item) => item.name === "avoidedTrafficAccidentsDeaths",
                  )?.total ?? 0
                }
              />
            );

          default: {
            const subSectionSegments = impactSubSectionName && [
              getSubSectionBreadcrumb(impactSubSectionName),
            ];
            const impactNameSegments = impactDetailsName && [
              {
                label: getSocialImpactLabel(impactName),
                contentState: {
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
