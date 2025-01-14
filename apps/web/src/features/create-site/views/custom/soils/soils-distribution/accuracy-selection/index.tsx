import { revertSoilsSurfaceAreaDistributionEntryModeStep } from "@/features/create-site/core/actions/createSite.actions";
import { completeSoilsSurfaceAreaDistributionEntryMode } from "@/features/create-site/core/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import AccuracySelectionForm, { type FormValues } from "./AccuracySelectionForm";

function SiteSoilsDistributionAccuracySelectionContainer() {
  const isFriche = useAppSelector((state) => state.siteCreation.siteData.isFriche) ?? false;
  const dispatch = useAppDispatch();

  const onSubmit = ({ accuracy }: FormValues) => {
    dispatch(completeSoilsSurfaceAreaDistributionEntryMode(accuracy));
  };

  const onBack = () => {
    dispatch(revertSoilsSurfaceAreaDistributionEntryModeStep());
  };

  return <AccuracySelectionForm onSubmit={onSubmit} onBack={onBack} isFriche={isFriche} />;
}

export default SiteSoilsDistributionAccuracySelectionContainer;
