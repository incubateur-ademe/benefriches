import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import UrbanZoneFinalSummary from "./UrbanZoneFinalSummary";

function UrbanZoneFinalSummaryContainer() {
  const { onBack, onSave, selectUrbanZoneFinalSummaryViewData } = useUrbanZoneSiteForm();
  const viewData = useAppSelector(selectUrbanZoneFinalSummaryViewData);

  return <UrbanZoneFinalSummary {...viewData} onNext={onSave} onBack={onBack} />;
}

export default UrbanZoneFinalSummaryContainer;
