import ImpactSynthesisView from "./ImpactSynthesisView";

import {
  getAvoidedCo2eqEmissions,
  getAvoidedFricheCostsForLocalAuthority,
  getCategoryFilter,
  getFullTimeJobsImpact,
  getHouseholdsPoweredByRenewableEnergy,
  getLocalPropertyValueIncrease,
  getNonContaminatedSurfaceArea,
  getPermeableSurfaceArea,
  getProjectImpactBalance,
  getRelatedSiteInfos,
  getTaxesIncomeImpact,
} from "@/features/projects/application/projectImpactsSynthetics.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

const ImpactsSynthesisViewContainer = () => {
  const categoryFilter = useAppSelector(getCategoryFilter);
  const { isFriche, isAgriculturalFriche } = useAppSelector(getRelatedSiteInfos);
  const projectImpactBalance = useAppSelector(getProjectImpactBalance);
  const avoidedFricheCostsForLocalAuthority = useAppSelector(
    getAvoidedFricheCostsForLocalAuthority,
  );
  const taxesIncomesImpact = useAppSelector(getTaxesIncomeImpact);
  const fullTimeJobs = useAppSelector(getFullTimeJobsImpact);
  const householdsPoweredByRenewableEnergy = useAppSelector(getHouseholdsPoweredByRenewableEnergy);
  const avoidedCo2eqEmissions = useAppSelector(getAvoidedCo2eqEmissions);
  const permeableSurfaceArea = useAppSelector(getPermeableSurfaceArea);
  const nonContaminatedSurfaceArea = useAppSelector(getNonContaminatedSurfaceArea);
  const localPropertyValueIncrease = useAppSelector(getLocalPropertyValueIncrease);

  return (
    <ImpactSynthesisView
      categoryFilter={categoryFilter}
      isFriche={isFriche}
      isAgriculturalFriche={isAgriculturalFriche}
      impacts={{
        projectImpactBalance,
        avoidedFricheCostsForLocalAuthority,
        taxesIncomesImpact,
        fullTimeJobs,
        householdsPoweredByRenewableEnergy,
        permeableSurfaceArea,
        avoidedCo2eqEmissions,
        nonContaminatedSurfaceArea,
        localPropertyValueIncrease,
      }}
    />
  );
};

export default ImpactsSynthesisViewContainer;
