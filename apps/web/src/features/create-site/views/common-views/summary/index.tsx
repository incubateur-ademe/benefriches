import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";
import { SiteFeaturesSectionId } from "@/features/sites/views/features/SiteFeaturesList";
import { getSummarySectionProps } from "@/shared/views/components/FeaturesList/summarySectionProps";

import SiteDataSummary from "./SiteDataSummary";

function SiteDataSummaryContainer() {
  const {
    onBack,
    onSave,
    onNavigateToStep,
    selectDerivedSiteData,
    selectSaveState,
    selectCustomSummarySections,
  } = useCustomSiteForm();
  const siteData = useAppSelector(selectDerivedSiteData);
  const saveState = useAppSelector(selectSaveState);
  const summarySections = useAppSelector(selectCustomSummarySections);

  const sectionProps = Object.fromEntries(
    (Object.keys(summarySections) as SiteFeaturesSectionId[]).map((sectionId) => [
      sectionId,
      getSummarySectionProps(summarySections[sectionId] ?? [], onNavigateToStep),
    ]),
  );

  return (
    <SiteDataSummary
      sectionProps={sectionProps}
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
