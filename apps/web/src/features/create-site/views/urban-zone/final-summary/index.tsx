import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";
import { getSummarySectionProps } from "@/shared/views/components/FeaturesList/summarySectionProps";

import UrbanZoneFinalSummary, { UrbanZoneFinalSummarySectionId } from "./UrbanZoneFinalSummary";

function UrbanZoneFinalSummaryContainer() {
  const {
    onBack,
    onSave,
    onNavigateToStep,
    onNavigateToCustomStep,
    selectUrbanZoneFinalSummaryViewData,
    selectSaveState,
    selectUrbanZoneSummarySections,
  } = useUrbanZoneSiteForm();
  const viewData = useAppSelector(selectUrbanZoneFinalSummaryViewData);
  const saveState = useAppSelector(selectSaveState);
  const summarySections = useAppSelector(selectUrbanZoneSummarySections);

  const sectionProps: Partial<
    Record<UrbanZoneFinalSummarySectionId, ReturnType<typeof getSummarySectionProps>>
  > = {
    // 📍 Localisation's data (address, urban-zone type) lives on the custom engine, not this
    // sub-flow's own step sequence — so it is not part of `summarySections`, and its button
    // navigates through the cross-engine `onNavigateToCustomStep` instead. Always complete by
    // the time this final-summary step is reachable, so no warning here.
    LOCATION: {
      buttonProps: {
        iconId: "fr-icon-pencil-line",
        children: "Modifier",
        onClick: () => {
          onNavigateToCustomStep("ADDRESS");
        },
      },
    },
    LAND_PARCELS: getSummarySectionProps(summarySections.LAND_PARCELS ?? [], onNavigateToStep),
    SOILS: getSummarySectionProps(summarySections.SOILS ?? [], onNavigateToStep),
    CONTAMINATION: getSummarySectionProps(summarySections.CONTAMINATION ?? [], onNavigateToStep),
    MANAGEMENT: getSummarySectionProps(summarySections.MANAGEMENT ?? [], onNavigateToStep),
    NAMING: getSummarySectionProps(summarySections.NAMING ?? [], onNavigateToStep),
  };

  return (
    <UrbanZoneFinalSummary
      {...viewData}
      onNext={onSave}
      onBack={onBack}
      saveState={saveState}
      sectionProps={sectionProps}
    />
  );
}

export default UrbanZoneFinalSummaryContainer;
