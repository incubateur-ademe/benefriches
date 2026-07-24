import { lazy, Suspense } from "react";
import {
  AggregatedReconversionProjectOnSiteImpactItemView,
  ReconversionProjectOnSiteIndirectEconomicImpactItemView,
} from "shared";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";
import {
  SocioEconomicDetailsName,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import ImpactInProgressDescriptionModal from "@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { getSocioEconomicImpactLabel } from "../../../getImpactLabel";
import { humanityBreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

const AvoidedAirPollutionDescription = lazy(
  () => import("../avoided-air-pollution/AvoidedAirPollutionDescription"),
);
const AirConditionningRelatedCo2MonetaryValueDescription = lazy(
  () => import("../avoided-co2-monetary-value/AirConditionningRelatedCo2MonetaryValueDescription"),
);
const AvoidedCo2MonetaryValueDescription = lazy(
  () => import("../avoided-co2-monetary-value/AvoidedCo2MonetaryValueDescription"),
);
const RenewableEnergyRelatedCo2MonetaryValueDescription = lazy(
  () => import("../avoided-co2-monetary-value/RenewableEnergyRelatedCo2MonetaryValueDescription"),
);
const TravelRelatedCo2MonetaryValueDescription = lazy(
  () => import("../avoided-co2-monetary-value/TravelRelatedCo2MonetaryValueDescription"),
);
const AvoidedTrafficAccidentsDeathsMonetaryValueDescription = lazy(
  () =>
    import("../avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsDeathsDescription"),
);
const AvoidedTrafficAccidentsMonetaryValueDescription = lazy(
  () => import("../avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsDescription"),
);
const AvoidedTrafficAccidentsMinorInjuriesMonetaryValueDescription = lazy(
  () => import("../avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsMinorInjuries"),
);
const AvoidedTrafficAccidentsSevereInjuriesMonetaryValueDescription = lazy(
  () =>
    import("../avoided-traffic-accidents-monetary-value/AvoidedTrafficAccidentsSevereInjuriesDescription"),
);
const EcosystemServicesDescription = lazy(
  () => import("../ecosystem-services/EcosystemServicesDescription"),
);
const ForestRelatedProductDescription = lazy(
  () => import("../ecosystem-services/ForestRelatedProductDescription"),
);
const InvasiveSpeciesRegulationDescription = lazy(
  () => import("../ecosystem-services/InvasiveSpeciesRegulationDescription"),
);
const NatureRelatedWellnessAndLeisureDescription = lazy(
  () => import("../ecosystem-services/NatureRelatedWellnessAndLeisureDescription"),
);
const NitrogenCycleDescription = lazy(
  () => import("../ecosystem-services/NitrogenCycleDescription"),
);
const PollinationDescription = lazy(() => import("../ecosystem-services/PollinationDescription"));
const SoilErosionDescription = lazy(() => import("../ecosystem-services/SoilErosionDescription"));
const SoilsStorageRelatedCo2MonetaryValueDescription = lazy(
  () => import("../ecosystem-services/SoilsStorageRelatedCo2MonetaryValueDescription"),
);
const WaterCycle = lazy(() => import("../ecosystem-services/WaterCycle"));
const HumanityDescription = lazy(() => import("../HumanityDescription"));

type Props = {
  impactName?: SocioEconomicMainImpactName;
  impactDetailsName?: SocioEconomicDetailsName;
  contextData: ModalDataProps["contextData"];
  reconversionImpactsBreakdown: ModalDataProps["impactsData"]["reconversionImpactsBreakdown"];
  indirectEconomicImpactsByBearer: IndirectEconomicImpactsByBearerAndGroupCategory<AggregatedReconversionProjectOnSiteImpactItemView>;
};

export function HumanityModalWizard({
  impactName,
  impactDetailsName,
  contextData,
  indirectEconomicImpactsByBearer,
  reconversionImpactsBreakdown,
}: Props) {
  const baseSoilsDistribution = reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.filter(
    (item) => item.name === "soilsDistribution",
  );
  const forecastSoilsDistribution =
    reconversionImpactsBreakdown.projectIndirectImpactMetrics.filter(
      (item) => item.name === "soilsDistribution",
    );
  if (!impactName) {
    return <HumanityDescription impactsData={indirectEconomicImpactsByBearer.humanity} />;
  }
  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      {(() => {
        switch (impactDetailsName ?? impactName) {
          case "avoidedCo2eqEmissions":
            return (
              <AvoidedCo2MonetaryValueDescription
                impactsData={indirectEconomicImpactsByBearer.humanity.environmentalAction?.filter(
                  (item): item is ReconversionProjectOnSiteIndirectEconomicImpactItemView =>
                    item.name === "avoidedCo2eqWithEnergyProduction" ||
                    item.name === "avoidedTrafficCo2EqEmissions" ||
                    item.name === "avoidedAirConditioningCo2eqEmissions",
                )}
              />
            );

          case "avoidedCo2eqWithEnergyProduction":
            return (
              <RenewableEnergyRelatedCo2MonetaryValueDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "avoidedCo2eqWithEnergyProduction",
                  )?.total
                }
                projectDevelopmentPlan={
                  contextData.projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                    ? contextData.projectDevelopmentPlan
                    : undefined
                }
                siteData={{ address: contextData.siteAddress.label }}
              />
            );

          case "avoidedTrafficCo2EqEmissions":
            return (
              <TravelRelatedCo2MonetaryValueDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "avoidedTrafficCo2EqEmissions",
                  )?.total
                }
              />
            );

          case "avoidedAirConditioningCo2eqEmissions":
            return (
              <AirConditionningRelatedCo2MonetaryValueDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "avoidedAirConditioningCo2eqEmissions",
                  )?.total
                }
              />
            );

          case "ecosystemServices":
            return (
              <EcosystemServicesDescription
                impactsData={indirectEconomicImpactsByBearer.humanity.environmentalAction}
              />
            );

          case "newStoredCo2Eq":
            return (
              <SoilsStorageRelatedCo2MonetaryValueDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "newStoredCo2Eq",
                  )?.total
                }
                baseSoilsDistribution={baseSoilsDistribution}
                forecastSoilsDistribution={forecastSoilsDistribution}
              />
            );

          case "natureRelatedWelnessAndLeisure":
            return (
              <NatureRelatedWellnessAndLeisureDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "natureRelatedWelnessAndLeisure",
                  )?.total
                }
                baseSoilsDistribution={baseSoilsDistribution}
                forecastSoilsDistribution={forecastSoilsDistribution}
              />
            );
          case "forestRelatedProduct":
            return (
              <ForestRelatedProductDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "forestRelatedProduct",
                  )?.total
                }
                baseSoilsDistribution={baseSoilsDistribution}
                forecastSoilsDistribution={forecastSoilsDistribution}
              />
            );

          case "invasiveSpeciesRegulation":
            return (
              <InvasiveSpeciesRegulationDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "invasiveSpeciesRegulation",
                  )?.total
                }
                baseSoilsDistribution={baseSoilsDistribution}
                forecastSoilsDistribution={forecastSoilsDistribution}
              />
            );
          case "nitrogenCycle":
            return (
              <NitrogenCycleDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "nitrogenCycle",
                  )?.total
                }
                baseSoilsDistribution={baseSoilsDistribution}
                forecastSoilsDistribution={forecastSoilsDistribution}
              />
            );
          case "pollination":
            return (
              <PollinationDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "pollination",
                  )?.total
                }
                baseSoilsDistribution={baseSoilsDistribution}
                forecastSoilsDistribution={forecastSoilsDistribution}
              />
            );
          case "soilErosion":
            return (
              <SoilErosionDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "soilErosion",
                  )?.total
                }
                baseSoilsDistribution={baseSoilsDistribution}
                forecastSoilsDistribution={forecastSoilsDistribution}
              />
            );
          case "waterCycle":
            return (
              <WaterCycle
                impactData={
                  indirectEconomicImpactsByBearer.humanity.environmentalAction?.find(
                    (item) => item.name === "waterCycle",
                  )?.total
                }
                baseSoilsDistribution={baseSoilsDistribution}
                forecastSoilsDistribution={forecastSoilsDistribution}
              />
            );

          case "avoidedAirPollutionHealthExpenses":
            return (
              <AvoidedAirPollutionDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.avoidedHealthExpenses?.find(
                    (item) => item.name === "avoidedAirPollutionHealthExpenses",
                  )?.total
                }
              />
            );

          case "avoidedTrafficAccidents":
            return (
              <AvoidedTrafficAccidentsMonetaryValueDescription
                impactsData={indirectEconomicImpactsByBearer.humanity.avoidedHealthExpenses}
              />
            );
          case "avoidedAccidentsMinorInjuriesExpenses":
            return (
              <AvoidedTrafficAccidentsMinorInjuriesMonetaryValueDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.avoidedHealthExpenses?.find(
                    (item) => item.name === "avoidedAccidentsMinorInjuriesExpenses",
                  )?.total
                }
              />
            );
          case "avoidedAccidentsSevereInjuriesExpenses":
            return (
              <AvoidedTrafficAccidentsSevereInjuriesMonetaryValueDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.avoidedHealthExpenses?.find(
                    (item) => item.name === "avoidedAccidentsSevereInjuriesExpenses",
                  )?.total
                }
              />
            );

          case "avoidedAccidentsDeathsExpenses":
            return (
              <AvoidedTrafficAccidentsDeathsMonetaryValueDescription
                impactData={
                  indirectEconomicImpactsByBearer.humanity.avoidedHealthExpenses?.find(
                    (item) => item.name === "avoidedAccidentsDeathsExpenses",
                  )?.total
                }
              />
            );

          default:
            return (
              <ImpactInProgressDescriptionModal
                title={getSocioEconomicImpactLabel(impactDetailsName ?? impactName)}
                breadcrumbProps={{
                  section: mainBreadcrumbSection,
                  segments: [
                    humanityBreadcrumbSection,
                    ...(impactDetailsName
                      ? [
                          {
                            label: getSocioEconomicImpactLabel(impactName),
                            contentState: {
                              sectionName: "socio_economic" as const,
                              subSectionName: "humanity" as const,
                              impactName,
                            },
                          },
                        ]
                      : []),
                  ],
                }}
              />
            );
        }
      })()}
    </Suspense>
  );
}
