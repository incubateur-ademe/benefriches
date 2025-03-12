import { revertSoilsSurfaceAreaDistributionEntryModeStep } from "@/features/create-site/core/actions/createSite.actions";
import { soilsSurfaceAreaDistributionEntryModeCompleted } from "@/features/create-site/core/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import AccuracySelectionForm, { type FormValues } from "./AccuracySelectionForm";

function SiteSoilsDistributionAccuracySelectionContainer() {
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);
  const dispatch = useAppDispatch();

  const onSubmit = ({ accuracy }: FormValues) => {
    dispatch(soilsSurfaceAreaDistributionEntryModeCompleted(accuracy));
  };

  const onBack = () => {
    dispatch(revertSoilsSurfaceAreaDistributionEntryModeStep());
  };

  return <AccuracySelectionForm onSubmit={onSubmit} onBack={onBack} siteNature={siteNature} />;
}

export default SiteSoilsDistributionAccuracySelectionContainer;
