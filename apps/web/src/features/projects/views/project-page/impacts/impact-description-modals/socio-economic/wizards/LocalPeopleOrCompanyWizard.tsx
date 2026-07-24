import { lazy, Suspense } from "react";
import {
  AggregatedReconversionProjectOnSiteImpactItemView,
  AvoidedFricheCostsIndirectEconomicImpactItemView,
  ReconversionStakeholders,
  sumListWithKey,
} from "shared";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/core/groupIndirectImpactsByBearer";
import {
  SocioEconomicDetailsName,
  SocioEconomicMainImpactName,
} from "@/features/projects/core/projectImpactsSocioEconomic";
import ImpactInProgressDescriptionModal from "@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { getSocioEconomicImpactLabel } from "../../../getImpactLabel";
import {
  localPeopleOrCompanyBreadcrumbSection,
  mainBreadcrumbSection,
} from "../breadcrumbSections";

const AvoidedAirConditionningExpensesDescription = lazy(
  () => import("../avoided-air-conditionning-expenses/AvoidedAirConditionningExpensesDescription"),
);
const AvoidedCarRelatedExpensesDescription = lazy(
  () => import("../avoided-car-related-expenses/AvoidedCarRelatedExpensesDescription"),
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
const AvoidedPropertyDamagesExpenses = lazy(
  () => import("../avoided-property-damages-expenses/AvoidedPropertyDamagesExpenses"),
);
const PropertyValueIncreaseDescription = lazy(
  () => import("../property-value-increase/PropertyValueIncreaseDescription"),
);
const RentalIncomeDescription = lazy(() => import("../rental-income/RentalIncomeDescription"));
const TimeTravelSavedMonetaryValueDescription = lazy(
  () => import("../time-travel-saved/TimeTravelSavedMonetaryValueDescription"),
);

const LocalPeopleOrCompanyDescription = lazy(() => import("../LocalPeopleOrCompanyDescription"));

type Props = {
  impactName?: SocioEconomicMainImpactName;
  impactDetailsName?: SocioEconomicDetailsName;
  contextData: ModalDataProps["contextData"];
  indirectEconomicImpactsByBearer: IndirectEconomicImpactsByBearerAndGroupCategory<AggregatedReconversionProjectOnSiteImpactItemView>;
  stakeholders: ReconversionStakeholders;
};

export function LocalPeopleOrCompanyModalWizard({
  impactName,
  impactDetailsName,
  contextData,
  indirectEconomicImpactsByBearer,
  stakeholders,
}: Props) {
  if (!impactName) {
    return (
      <LocalPeopleOrCompanyDescription
        impactsData={indirectEconomicImpactsByBearer.localPeopleOrCompany}
      />
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
                bearer="localPeopleOrCompany"
                developmentPlan={contextData.projectDevelopmentPlan}
                impactData={sumListWithKey(
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.rentalIncome ?? [],
                  "total",
                )}
              />
            );

          case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
            return (
              <AvoidedFricheCostsDescription
                bearerName={stakeholders.current.owner.structureName ?? "l'actuel propriétaire"}
                sectionName="localPeopleOrCompany"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForOwner"
                impactData={indirectEconomicImpactsByBearer.localPeopleOrCompany.fricheCosts?.filter(
                  (impact): impact is AvoidedFricheCostsIndirectEconomicImpactItemView =>
                    impact.name === "avoidedFricheMaintenanceAndSecuringCostsForOwner",
                )}
              />
            );
          case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
            return (
              <AvoidedFricheCostsDescription
                bearerName={stakeholders.current.owner.structureName ?? "l'actuel propriétaire"}
                sectionName="localPeopleOrCompany"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForTenant"
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.fricheCosts?.filter(
                    (impact): impact is AvoidedFricheCostsIndirectEconomicImpactItemView =>
                      impact.name === "avoidedFricheMaintenanceAndSecuringCostsForTenant",
                  ) ?? []
                }
              />
            );

          case "avoidedFricheMaintenanceAndSecuringCostsForTenant.illegalDumpingCost":
            return (
              <AvoidedIllegalDumpingCostsDescription
                bearerName={stakeholders.current.tenant?.structureName ?? "l'actuel locataire"}
                sectionName="localPeopleOrCompany"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForTenant"
                addressLabel={contextData.siteAddress.label}
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.fricheCosts?.find(
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
                sectionName="localPeopleOrCompany"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForOwner"
                addressLabel={contextData.siteAddress.label}
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.fricheCosts?.find(
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
                sectionName="localPeopleOrCompany"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForTenant"
                siteSurfaceArea={contextData.siteSurfaceArea}
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.fricheCosts?.find(
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
                sectionName="localPeopleOrCompany"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForOwner"
                siteSurfaceArea={contextData.siteSurfaceArea}
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.fricheCosts?.find(
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
                sectionName="localPeopleOrCompany"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForOwner"
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.fricheCosts?.find(
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
                sectionName="localPeopleOrCompany"
                impactName="avoidedFricheMaintenanceAndSecuringCostsForTenant"
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.fricheCosts?.find(
                    (impact) =>
                      impact.name === "avoidedFricheMaintenanceAndSecuringCostsForTenant" &&
                      impact.details === "otherSecuringCosts",
                  )?.total
                }
              />
            );

          case "localPropertyValueIncrease":
            return (
              <PropertyValueIncreaseDescription
                siteSurfaceArea={contextData.siteSurfaceArea}
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.localPropertyValueIncrease?.find(
                    (impact) => impact.name === "localPropertyValueIncrease",
                  )?.total
                }
              />
            );

          case "avoidedPropertyDamageExpenses":
            return (
              <AvoidedPropertyDamagesExpenses
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.purchasingPowerIncrease?.find(
                    (impact) => impact.name === "avoidedPropertyDamageExpenses",
                  )?.total
                }
              />
            );

          case "avoidedAirConditioningExpenses":
            return (
              <AvoidedAirConditionningExpensesDescription
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.purchasingPowerIncrease?.find(
                    (impact) => impact.name === "avoidedAirConditioningExpenses",
                  )?.total
                }
              />
            );

          case "travelTimeSavedPerTravelerExpenses":
            return (
              <TimeTravelSavedMonetaryValueDescription
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.purchasingPowerIncrease?.find(
                    (item) => item.name === "travelTimeSavedPerTravelerExpenses",
                  )?.total
                }
              />
            );

          case "avoidedCarRelatedExpenses":
            return (
              <AvoidedCarRelatedExpensesDescription
                impactData={
                  indirectEconomicImpactsByBearer.localPeopleOrCompany.purchasingPowerIncrease?.find(
                    (item) => item.name === "avoidedCarRelatedExpenses",
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
                    localPeopleOrCompanyBreadcrumbSection,
                    ...(impactDetailsName
                      ? [
                          {
                            label: getSocioEconomicImpactLabel(impactName),
                            contentState: {
                              sectionName: "socio_economic" as const,
                              subSectionName: "localPeopleOrCompany" as const,
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
