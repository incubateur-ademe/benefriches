import { lazy, Suspense } from "react";

import { KeyImpactIndicatorData } from "@/features/projects/core/projectKeyImpactIndicators";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { ContentState } from "../../ImpactModalDescriptionContext";

const SummaryAvoidedCo2eqEmissionsDescription = lazy(() => import("./AvoidedCo2eqEmissions"));
const SummaryAvoidedFricheCostsForLocalAuthorityDescription = lazy(
  () => import("./AvoidedFricheCostsForLocalAuthority"),
);
const SummaryFullTimeJobsDescription = lazy(() => import("./FullTimeJobs"));
const SummaryHouseholdsPoweredByRenewableEnergyDescription = lazy(
  () => import("./HouseholdsPoweredByRenewableEnergy"),
);
const SummaryLocalPropertyValueIncreaseDescription = lazy(
  () => import("./LocalPropertyValueIncrease"),
);
const SummaryNonContaminatedSurfaceAreaDescription = lazy(
  () => import("./NonContaminatedSurfaceArea"),
);
const SummaryPermeableSurfaceAreaDescription = lazy(() => import("./PermeableSurfaceArea"));
const SummaryProjectBalanceDescription = lazy(() => import("./ProjectBalance"));
const SummaryTaxesIncomeDescription = lazy(() => import("./TaxesIncome"));
const SummaryZanComplianceDescription = lazy(() => import("./ZanCompliance"));

type Props = {
  impactsData: KeyImpactIndicatorData[];
  contentState: Extract<ContentState, { sectionName: "summary" }>;
};

function findImpactData<N extends KeyImpactIndicatorData["name"]>(
  impactsData: KeyImpactIndicatorData[],
  name: N,
): Extract<KeyImpactIndicatorData, { name: N }> {
  return impactsData.find(
    (item): item is Extract<KeyImpactIndicatorData, { name: N }> => item.name === name,
  )!;
}

export function SummaryModalWizard({ impactsData, contentState }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      {(() => {
        switch (contentState.impactDetailsName) {
          case "zanCompliance":
            return (
              <SummaryZanComplianceDescription
                impactData={findImpactData(impactsData, "zanCompliance")}
              />
            );
          case "projectImpactBalance":
            return (
              <SummaryProjectBalanceDescription
                impactData={findImpactData(impactsData, "projectImpactBalance")}
              />
            );
          case "avoidedFricheCostsForLocalAuthority":
            return (
              <SummaryAvoidedFricheCostsForLocalAuthorityDescription
                impactData={findImpactData(impactsData, "avoidedFricheCostsForLocalAuthority")}
              />
            );
          case "taxesIncomesImpact":
            return (
              <SummaryTaxesIncomeDescription
                impactData={findImpactData(impactsData, "taxesIncomesImpact")}
              />
            );
          case "fullTimeJobs":
            return (
              <SummaryFullTimeJobsDescription
                impactData={findImpactData(impactsData, "fullTimeJobs")}
              />
            );
          case "avoidedCo2eqEmissions":
            return (
              <SummaryAvoidedCo2eqEmissionsDescription
                impactData={findImpactData(impactsData, "avoidedCo2eqEmissions")}
              />
            );
          case "nonContaminatedSurfaceArea":
            return (
              <SummaryNonContaminatedSurfaceAreaDescription
                impactData={findImpactData(impactsData, "nonContaminatedSurfaceArea")}
              />
            );
          case "permeableSurfaceArea":
            return (
              <SummaryPermeableSurfaceAreaDescription
                impactData={findImpactData(impactsData, "permeableSurfaceArea")}
              />
            );
          case "householdsPoweredByRenewableEnergy":
            return (
              <SummaryHouseholdsPoweredByRenewableEnergyDescription
                impactData={findImpactData(impactsData, "householdsPoweredByRenewableEnergy")}
              />
            );
          case "localPropertyValueIncrease":
            return (
              <SummaryLocalPropertyValueIncreaseDescription
                impactData={findImpactData(impactsData, "localPropertyValueIncrease")}
              />
            );
        }
      })()}
    </Suspense>
  );
}
