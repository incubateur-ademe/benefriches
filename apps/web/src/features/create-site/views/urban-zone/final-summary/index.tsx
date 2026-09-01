import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import UrbanZoneFinalSummary from "./UrbanZoneFinalSummary";

function UrbanZoneFinalSummaryContainer() {
  const { onBack, onSave, selectUrbanZoneFinalSummaryViewData, selectSaveState } =
    useUrbanZoneSiteForm();
  const viewData = useAppSelector(selectUrbanZoneFinalSummaryViewData);
  const saveState = useAppSelector(selectSaveState);

  return (
    <UrbanZoneFinalSummary {...viewData} onNext={onSave} onBack={onBack} saveState={saveState} />
  );
}

export default UrbanZoneFinalSummaryContainer;
