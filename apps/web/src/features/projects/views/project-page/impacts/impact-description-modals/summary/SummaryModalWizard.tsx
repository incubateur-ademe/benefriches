import { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";

import SummaryAvoidedCo2eqEmissionsDescription from "./AvoidedCo2eqEmissions";
import SummaryAvoidedFricheCostsForLocalAuthorityDescription from "./AvoidedFricheCostsForLocalAuthority";
import SummaryFullTimeJobsDescription from "./FullTimeJobs";
import SummaryHouseholdsPoweredByRenewableEnergyDescription from "./HouseholdsPoweredByRenewableEnergy";
import SummaryLocalPropertyValueIncreaseDescription from "./LocalPropertyValueIncrease";
import SummaryNonContaminatedSurfaceAreaDescription from "./NonContaminatedSurfaceArea";
import SummaryPermeableSurfaceAreaDescription from "./PermeableSurfaceArea";
import SummaryProjectBalanceDescription from "./ProjectBalance";
import SummaryTaxesIncomeDescription from "./TaxesIncome";
import SummaryZanComplianceDescription from "./ZanCompliance";

type Props = {
  impactData: KeyImpactIndicatorData;
};

export function SummaryModalWizard({ impactData }: Props) {
  switch (impactData.name) {
    case "zanCompliance":
      return <SummaryZanComplianceDescription impactData={impactData} />;
    case "projectImpactBalance":
      return <SummaryProjectBalanceDescription impactData={impactData} />;
    case "avoidedFricheCostsForLocalAuthority":
      return <SummaryAvoidedFricheCostsForLocalAuthorityDescription impactData={impactData} />;
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
  }
}
