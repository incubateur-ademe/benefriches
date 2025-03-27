import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { soilsSurfaceAreaDistributionEntryModeCompleted } from "@/features/create-site/core/actions/spaces.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import AccuracySelectionForm, { type FormValues } from "./AccuracySelectionForm";

function SiteSoilsDistributionAccuracySelectionContainer() {
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);
  const dispatch = useAppDispatch();

  const onSubmit = ({ accuracy }: FormValues) => {
    dispatch(soilsSurfaceAreaDistributionEntryModeCompleted(accuracy));
  };

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  return <AccuracySelectionForm onSubmit={onSubmit} onBack={onBack} siteNature={siteNature} />;
}

export default SiteSoilsDistributionAccuracySelectionContainer;
