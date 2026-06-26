import { lazy, Suspense } from "react";

import {
  EnvironmentalImpactDetailsName,
  EnvironmentalMainImpactName,
  getEnvironmentalProjectImpacts,
} from "@/features/projects/domain/projectImpactsEnvironmental";
import { EnvironmentSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  getEnvironmentalDetailsImpactLabel,
  getEnvironmentalImpactLabel,
} from "../../getImpactLabel";
import { ModalDataProps } from "../ImpactModalDescription";
import { getSubSectionBreadcrumb, mainBreadcrumbSection } from "./breadcrumbSections";

const ImpactInProgressDescriptionModal = lazy(
  () => import("@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal"),
);
const Co2SubSectionDescription = lazy(() => import("./Co2SubSectionDescription"));
const EnvironmentalMainDescription = lazy(() => import("./EnvironmentalMainDescription"));
const SoilsSubSectionDescription = lazy(() => import("./SoilsSubSectionDescription"));
const AirConditionningRelatedCo2Description = lazy(
  () => import("./impact-co2/AirConditionningRelatedCo2Description"),
);
const Co2EqEmissionsDescription = lazy(() => import("./impact-co2/Co2EqEmissionsDescription"));
const RenewableEnergyRelatedCo2Description = lazy(
  () => import("./impact-co2/RenewableEnergyRelatedCo2Description"),
);
const SoilsStorageRelatedCo2Description = lazy(
  () => import("./impact-co2/SoilsStorageRelatedCo2Description"),
);
const TravelRelatedCo2Description = lazy(() => import("./impact-co2/TravelRelatedCo2Description"));
const NonContaminatedSurfaceDescription = lazy(
  () => import("./non-contaminated-surface/NonContaminatedSurface"),
);
const PermeableGreenSurfaceDescription = lazy(
  () => import("./permeable-surface/PermeableGreenSurface"),
);
const PermeableMineraleSurfaceDescription = lazy(
  () => import("./permeable-surface/PermeableMineraleSurface"),
);
const PermeableSurfaceDescription = lazy(() => import("./permeable-surface/PermeableSurface"));

type Props = {
  impactName?: EnvironmentalMainImpactName;
  impactDetailsName?: EnvironmentalImpactDetailsName;
  impactSubSectionName?: EnvironmentSubSectionName;
  projectData: ModalDataProps["projectData"];
  siteData: ModalDataProps["siteData"];
  impactsData: ModalDataProps["impactsData"];
};

export function EnvironmentalModalWizard({
  impactName,
  impactDetailsName,
  impactSubSectionName,
  projectData,
  siteData,
  impactsData,
}: Props) {
  const environmentalImpacts = getEnvironmentalProjectImpacts(impactsData, siteData.surfaceArea);
  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      {(() => {
        if (!impactName) {
          switch (impactSubSectionName) {
            case "co2":
              return <Co2SubSectionDescription />;
            case "soils":
              return <SoilsSubSectionDescription />;
            case undefined:
              return <EnvironmentalMainDescription />;
          }
        }

        switch (impactDetailsName ?? impactName) {
          case "co2_benefit":
            return (
              <Co2EqEmissionsDescription
                impactsData={environmentalImpacts.find((item) => item.name === "co2_benefit")}
              />
            );
          case "avoided_car_traffic_co2_eq_emissions":
            return (
              <TravelRelatedCo2Description
                impactData={
                  impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
                    (item) => item.name === "avoidedTrafficCo2EqEmissions",
                  )?.total
                }
              />
            );
          case "avoided_co2_eq_emissions_with_production":
            return (
              <RenewableEnergyRelatedCo2Description
                siteData={{ address: siteData.addressLabel }}
                impactData={
                  impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
                    (item) => item.name === "avoidedCO2TonsWithEnergyProduction",
                  )?.total
                }
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
                impactData={
                  impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
                    (item) => item.name === "newStoredCo2Eq",
                  )?.total
                }
              />
            );

          case "avoided_air_conditioning_co2_eq_emissions":
            return (
              <AirConditionningRelatedCo2Description
                impactData={
                  impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
                    (item) => item.name === "avoidedAirConditioningCo2eqEmissions",
                  )?.total
                }
              />
            );
          case "non_contaminated_surface_area":
            return (
              <NonContaminatedSurfaceDescription
                impactData={
                  environmentalImpacts.find((item) => item.name === "non_contaminated_surface_area")
                    ?.impact
                }
              />
            );

          case "permeable_surface_area":
            return (
              <PermeableSurfaceDescription
                impactData={environmentalImpacts.find(
                  (item) => item.name === "permeable_surface_area",
                )}
              />
            );

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
                contentState: {
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
      })()}
    </Suspense>
  );
}
