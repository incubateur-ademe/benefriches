import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteDataSummary from "./SiteDataSummary";

function SiteDataSummaryContainer() {
  const { onBack, onSave, selectDerivedSiteData, selectSaveState } = useCustomSiteForm();
  const siteData = useAppSelector(selectDerivedSiteData);
  const saveState = useAppSelector(selectSaveState);

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
      onNext={onSave}
      onBack={onBack}
      saveState={saveState}
    />
  );
}

export default SiteDataSummaryContainer;
