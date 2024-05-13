import { completeSummary, revertStep } from "../../application/createSite.reducer";
import SiteDataSummary from "./SiteDataSummary";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteDataSummaryContainer() {
  const siteData = useAppSelector((state) => state.siteCreation.siteData);
  const dispatch = useAppDispatch();

  const onNext = () => {
    dispatch(completeSummary());
  };

  const onBack = () => {
    dispatch(revertStep());
  };

  return (
    <SiteDataSummary
      siteData={{
        address: siteData.address?.value ?? "",
        ownerName: siteData.owner?.name ?? "",
        operatorName: siteData.operator?.name,
        fullTimeJobsInvolved: siteData.fullTimeJobsInvolved ?? 0,
        accidents: siteData.hasRecentAccidents
          ? {
              accidentsDeaths: siteData.accidentsDeaths,
              severyInjuries: siteData.accidentsSevereInjuries,
              minorInjuries: siteData.accidentsMinorInjuries,
            }
          : null,
        expenses: siteData.yearlyExpenses ?? [],
        totalSurfaceArea: siteData.surfaceArea ?? 0,
        soilsDistribution: siteData.soilsDistribution ?? {},
        contaminatedSurfaceArea: siteData.contaminatedSoilSurface,
        name: siteData.name ?? "",
        description: siteData.description,
        fricheActivity: siteData.fricheActivity,
        isFriche: siteData.isFriche ?? false,
      }}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default SiteDataSummaryContainer;
