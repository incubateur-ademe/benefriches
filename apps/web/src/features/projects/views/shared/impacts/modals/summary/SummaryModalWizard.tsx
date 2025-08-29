import { lazy, Suspense } from "react";

import { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

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
const SummaryAvoidedMaintenanceCostsForLocalAuthorityDescription = lazy(
  () => import("./AvoidedMaintenanceCostsForLocalAuthority"),
);

type Props = {
  impactData: KeyImpactIndicatorData;
};

export function SummaryModalWizard({ impactData }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      {(() => {
        switch (impactData.name) {
          case "zanCompliance":
            return <SummaryZanComplianceDescription impactData={impactData} />;
          case "projectImpactBalance":
            return <SummaryProjectBalanceDescription impactData={impactData} />;
          case "avoidedFricheCostsForLocalAuthority":
            return (
              <SummaryAvoidedFricheCostsForLocalAuthorityDescription impactData={impactData} />
            );
          case "taxesIncomesImpact":
            return <SummaryTaxesIncomeDescription impactData={impactData} />;
          case "fullTimeJobs":
            return <SummaryFullTimeJobsDescription impactData={impactData} />;
          case "avoidedCo2eqEmissions":
            return <SummaryAvoidedCo2eqEmissionsDescription impactData={impactData} />;
          case "nonContaminatedSurfaceArea":
            return <SummaryNonContaminatedSurfaceAreaDescription impactData={impactData} />;
          case "permeableSurfaceArea":
            return <SummaryPermeableSurfaceAreaDescription impactData={impactData} />;
          case "householdsPoweredByRenewableEnergy":
            return <SummaryHouseholdsPoweredByRenewableEnergyDescription impactData={impactData} />;
          case "localPropertyValueIncrease":
            return <SummaryLocalPropertyValueIncreaseDescription impactData={impactData} />;
          case "avoidedMaintenanceCostsForLocalAuthority":
            return (
              <SummaryAvoidedMaintenanceCostsForLocalAuthorityDescription impactData={impactData} />
            );
        }
      })()}
    </Suspense>
  );
}
