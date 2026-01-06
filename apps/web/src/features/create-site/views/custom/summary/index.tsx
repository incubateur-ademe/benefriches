import { customSiteSaved } from "@/features/create-site/core/actions/finalStep.actions";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteDataSummary from "./SiteDataSummary";

function SiteDataSummaryContainer() {
  const siteData = useAppSelector((state) => state.siteCreation.siteData);
  const dispatch = useAppDispatch();

  const onNext = () => {
    void dispatch(customSiteSaved());
  };

  const onBack = () => {
    dispatch(stepReverted());
  };

  return (
    <SiteDataSummary
      siteData={{
        id: siteData.id,
        nature: siteData.nature!,
        address: siteData.address?.value ?? "",
        ownerName: siteData.owner?.name ?? "",
        tenantName: siteData.tenant?.name,
        accidents: siteData.hasRecentAccidents
          ? {
              accidentsDeaths: siteData.accidentsDeaths,
              severyInjuries: siteData.accidentsSevereInjuries,
              minorInjuries: siteData.accidentsMinorInjuries,
            }
          : null,
        expenses: siteData.yearlyExpenses,
        incomes: siteData.yearlyIncomes,
        totalSurfaceArea: siteData.surfaceArea ?? 0,
        soilsDistribution: siteData.soilsDistribution ?? {},
        contaminatedSurfaceArea: siteData.contaminatedSoilSurface,
        name: siteData.name ?? "",
        description: siteData.description,
        fricheActivity: siteData.fricheActivity,
        agriculturalOperationActivity: siteData.agriculturalOperationActivity,
        naturalAreaType: siteData.naturalAreaType,
      }}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default SiteDataSummaryContainer;
