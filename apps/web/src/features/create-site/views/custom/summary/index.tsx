import { customSiteSaved } from "@/features/create-site/core/actions/siteSaved.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { revertStep } from "../../../core/createSite.reducer";
import SiteDataSummary from "./SiteDataSummary";

function SiteDataSummaryContainer() {
  const siteData = useAppSelector((state) => state.siteCreation.siteData);
  const dispatch = useAppDispatch();

  const onNext = () => {
    void dispatch(customSiteSaved());
  };

  const onBack = () => {
    dispatch(revertStep());
  };

  return (
    <SiteDataSummary
      siteData={{
        id: siteData.id ?? "",
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
