import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { soilsSelectionStepCompleted } from "@/features/create-site/core/actions/spaces.actions";
import { selectSiteSoils } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSpacesSelectionForm, { FormValues } from "./SpacesSelectionForm";

const SiteSpacesSelectionFormContainer = () => {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);
  const soils = useAppSelector(selectSiteSoils);

  return (
    <SiteSpacesSelectionForm
      siteNature={siteNature}
      initialValues={{
        soils,
      }}
      onSubmit={(formData: FormValues) => {
        dispatch(soilsSelectionStepCompleted({ soils: formData.soils }));
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
};

export default SiteSpacesSelectionFormContainer;
