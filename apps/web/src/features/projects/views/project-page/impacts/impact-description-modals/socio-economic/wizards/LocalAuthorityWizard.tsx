import { lazy, Suspense } from "react";
import {
  AggregatedReconversionProjectOnSiteImpactItemView,
  AvoidedFricheCostsIndirectEconomicImpactItemView,
  ReconversionStakeholders,
  sumListWithKey,
} from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";
import {
  SocioEconomicDetailsName,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import ImpactInProgressDescriptionModal from "@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { getSocioEconomicImpactLabel } from "../../../getImpactLabel";
import { ModalDataProps } from "../../ImpactModalDescription";
import { localAuthorityBreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

const WaterRegulationDescription = lazy(
  () => import("../water-regulation/WaterRegulationDescription"),
);
const AvoidedFricheCostsDescription = lazy(
  () => import("../avoided-friche-costs/AvoidedFricheCostsDescription"),
);
const AvoidedIllegalDumpingCostsDescription = lazy(
  () => import("../avoided-friche-costs/AvoidedIllegalDumpingCostsDescription"),
);
const AvoidedOtherSecuringCostsDescription = lazy(
  () => import("../avoided-friche-costs/AvoidedOtherSecuringCostsDescription"),
);
const AvoidedSecurityCostsDescription = lazy(
  () => import("../avoided-friche-costs/AvoidedSecurityCostsDescription"),
);
const PropertyTransferDutiesIncreaseDescription = lazy(
  () => import("../property-value-increase/PropertyTransferDutiesIncreaseDescription"),
);
const RentalIncomeDescription = lazy(() => import("../rental-income/RentalIncomeDescription"));
const RoadsAndUtilitiesMaintenanceExpenses = lazy(
  () => import("../roads-and-utilities-maintenance-expenses/RoadsAndUtilitiesMaintenanceExpenses"),
);
const TaxesIncomeDescription = lazy(() => import("../taxes-income/TaxesIncomeDescription"));

const LocalAuthorityDescription = lazy(() => import("../LocalAuthorityDescription"));

type Props = {
  impactName?: SocioEconomicMainImpactName;
  impactDetailsName?: SocioEconomicDetailsName;
  contextData: ModalDataProps["contextData"];
  reconversionImpactsBreakdown: ModalDataProps["impactsData"]["reconversionImpactsBreakdown"];
  indirectEconomicImpactsByBearer: IndirectEconomicImpactsByBearerAndGroupCategory<AggregatedReconversionProjectOnSiteImpactItemView>;
  stakeholders: ReconversionStakeholders;
};

export function LocalAuthorityModalWizard({
  impactName,
  impactDetailsName,
  contextData,
  indirectEconomicImpactsByBearer,
  reconversionImpactsBreakdown,
  stakeholders,
}: Props) {
  const baseSoilsDistribution = reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.filter(
    (item) => item.name === "soilsDistribution",
  );
  const forecastSoilsDistribution =
    reconversionImpactsBreakdown.projectIndirectImpactMetrics.filter(
      (item) => item.name === "soilsDistribution",
    );
  if (!impactName) {
    return (
      <LocalAuthorityDescription impactsData={indirectEconomicImpactsByBearer.localAuthority} />
    );
  }
  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      {(() => {
        switch (impactDetailsName ?? impactName) {
          case "oldRentalIncomeLoss":
          case "projectedRentalIncome":
            return (
              <RentalIncomeDescription
                bearer="localAuthority"
                developmentPlan={contextData.projectDevelopmentPlan}
                impactData={sumListWithKey(
                  indirectEconomicImpactsByBearer.localAuthority.rentalIncome ?? [],
                  "total",
                )}
              />
            );

          case "taxesIncome":
            return (
              <TaxesIncomeDescription
                developmentPlan={contextData.projectDevelopmentPlan}
                impactData={indirectEconomicImpactsByBearer.localAuthority.taxesIncome}
              />
            );
          case "fricheRoadsAndUtilitiesExpenses":
            return (
              <RoadsAndUtilitiesMaintenanceExpenses
                surfaceArea={contextData.siteSurfaceArea}
                impactData={
                  indirectEconomicImpactsByBearer.localAuthority.municipalityExpenses?.find(
                    (impact) => impact.name === "fricheRoadsAndUtilitiesExpenses",
                  )?.total
                }
              />
            );

          case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
            return (
              <AvoidedFricheCostsDescription
                bearerName={stakeholders.current.owner.structureName ?? "l'actuel propriétaire"}
                sectionName="localAuthority"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForOwner"
                impactData={indirectEconomicImpactsByBearer.localAuthority.fricheCosts?.filter(
                  (impact): impact is AvoidedFricheCostsIndirectEconomicImpactItemView =>
                    impact.name === "avoidedFricheMaintenanceAndSecuringCostsForOwner",
                )}
              />
            );
          case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
            return (
              <AvoidedFricheCostsDescription
                bearerName={stakeholders.current.tenant?.structureName ?? "l'actuel locataire"}
                sectionName="localAuthority"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForTenant"
                impactData={indirectEconomicImpactsByBearer.localAuthority.fricheCosts?.filter(
                  (impact): impact is AvoidedFricheCostsIndirectEconomicImpactItemView =>
                    impact.name === "avoidedFricheMaintenanceAndSecuringCostsForTenant",
                )}
              />
            );

          case "avoidedFricheMaintenanceAndSecuringCostsForTenant.illegalDumpingCost":
            return (
              <AvoidedIllegalDumpingCostsDescription
                bearerName={stakeholders.current.tenant?.structureName ?? "l'actuel locataire"}
                sectionName="localAuthority"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForTenant"
                addressLabel={contextData.siteAddress.label}
                impactData={
                  indirectEconomicImpactsByBearer.localAuthority.fricheCosts?.find(
                    (impact) =>
                      impact.name === "avoidedFricheMaintenanceAndSecuringCostsForTenant" &&
                      impact.details === "illegalDumpingCost",
                  )?.total
                }
              />
            );
          case "avoidedFricheMaintenanceAndSecuringCostsForOwner.illegalDumpingCost":
            return (
              <AvoidedIllegalDumpingCostsDescription
                bearerName={stakeholders.current.owner.structureName ?? "l'actuel propriétaire"}
                sectionName="localAuthority"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForOwner"
                addressLabel={contextData.siteAddress.label}
                impactData={
                  indirectEconomicImpactsByBearer.localAuthority.fricheCosts?.find(
                    (impact) =>
                      impact.name === "avoidedFricheMaintenanceAndSecuringCostsForOwner" &&
                      impact.details === "illegalDumpingCost",
                  )?.total
                }
              />
            );
          case "avoidedFricheMaintenanceAndSecuringCostsForTenant.security":
            return (
              <AvoidedSecurityCostsDescription
                bearerName={stakeholders.current.tenant?.structureName ?? "l'actuel locataire"}
                sectionName="localAuthority"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForTenant"
                siteSurfaceArea={contextData.siteSurfaceArea}
                impactData={
                  indirectEconomicImpactsByBearer.localAuthority.fricheCosts?.find(
                    (impact) =>
                      (impact.name === "avoidedFricheMaintenanceAndSecuringCostsForOwner" ||
                        impact.name === "avoidedFricheMaintenanceAndSecuringCostsForTenant") &&
                      impact.details === "security",
                  )?.total
                }
              />
            );
          case "avoidedFricheMaintenanceAndSecuringCostsForOwner.security":
            return (
              <AvoidedSecurityCostsDescription
                bearerName={stakeholders.current.owner.structureName ?? "l'actuel propriétaire"}
                sectionName="localAuthority"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForOwner"
                siteSurfaceArea={contextData.siteSurfaceArea}
                impactData={
                  indirectEconomicImpactsByBearer.localAuthority.fricheCosts?.find(
                    (impact) =>
                      impact.name === "avoidedFricheMaintenanceAndSecuringCostsForOwner" &&
                      impact.details === "security",
                  )?.total
                }
              />
            );
          case "avoidedFricheMaintenanceAndSecuringCostsForOwner.otherSecuringCosts":
            return (
              <AvoidedOtherSecuringCostsDescription
                bearerName={stakeholders.current.owner.structureName ?? "l'actuel propriétaire"}
                sectionName="localAuthority"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForOwner"
                impactData={
                  indirectEconomicImpactsByBearer.localAuthority.fricheCosts?.find(
                    (impact) =>
                      impact.name === "avoidedFricheMaintenanceAndSecuringCostsForOwner" &&
                      impact.details === "otherSecuringCosts",
                  )?.total
                }
              />
            );
          case "avoidedFricheMaintenanceAndSecuringCostsForTenant.otherSecuringCosts":
            return (
              <AvoidedOtherSecuringCostsDescription
                bearerName={stakeholders.current.tenant?.structureName ?? "l'actuel locataire"}
                sectionName="localAuthority"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForTenant"
                impactData={
                  indirectEconomicImpactsByBearer.localAuthority.fricheCosts?.find(
                    (impact) =>
                      impact.name === "avoidedFricheMaintenanceAndSecuringCostsForTenant" &&
                      impact.details === "otherSecuringCosts",
                  )?.total
                }
              />
            );
          case "waterRegulation":
            return (
              <WaterRegulationDescription
                impactData={
                  indirectEconomicImpactsByBearer.localAuthority.municipalityExpenses?.find(
                    (item) => item.name === "waterRegulation",
                  )?.total
                }
                baseSoilsDistribution={baseSoilsDistribution}
                forecastSoilsDistribution={forecastSoilsDistribution}
                baseContaminatedSurface={
                  reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
                    (item) => item.name === "contaminatedSurface",
                  )?.total ?? 0
                }
                forecastContaminatedSurface={
                  reconversionImpactsBreakdown.projectIndirectImpactMetrics.find(
                    (item) => item.name === "decontaminatedSurface",
                  )?.total ?? 0
                }
              />
            );
          case "localTransferDutiesIncrease":
            return (
              <PropertyTransferDutiesIncreaseDescription
                impactData={
                  indirectEconomicImpactsByBearer.localAuthority.taxesIncome?.find(
                    (impact) => impact.name === "localTransferDutiesIncrease",
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
                    localAuthorityBreadcrumbSection,
                    ...(impactDetailsName
                      ? [
                          {
                            label: getSocioEconomicImpactLabel(impactName),
                            contentState: {
                              sectionName: "socio_economic" as const,
                              subSectionName: "localAuthority" as const,
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
