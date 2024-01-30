import { goToStep, SiteCreationStep } from "../../application/createSite.reducer";
import SiteDataSummary from "./SiteDataSummary";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteDataSummaryContainer() {
  const siteData = useAppSelector((state) => state.siteCreation.siteData);
  const dispatch = useAppDispatch();

  const onNext = () => {
    dispatch(goToStep(SiteCreationStep.CREATION_CONFIRMATION));
  };

  return (
    <SiteDataSummary
      siteData={{
        address: siteData.address?.value ?? "",
        ownerName: siteData.owner?.name ?? "",
        tenantName: siteData.tenant?.name,
        fullTimeJobsInvolved: siteData.fullTimeJobsInvolved ?? 0,
        accidents: siteData.hasRecentAccidents
          ? {
              deaths: siteData.deaths,
              severyInjuries: siteData.severeInjuriesPersons,
              minorInjuries: siteData.minorInjuriesPersons,
            }
          : null,
        expenses: siteData.yearlyExpenses ?? [],
        totalSurfaceArea: siteData.surfaceArea ?? 0,
        soilsDistribution: siteData.soilsDistribution ?? {},
        contaminatedSurfaceArea: siteData.contaminatedSoilSurface,
        name: siteData.name ?? "",
        description: siteData.description,
        fricheActivity: siteData.fricheActivity,
      }}
      onNext={onNext}
    />
  );
}

export default SiteDataSummaryContainer;
