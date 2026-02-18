import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { soilsSelectionStepCompleted } from "@/features/create-site/core/actions/spaces.actions";
import { selectSpacesSelectionFormViewData } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSpacesSelectionForm, { type FormValues } from "./SpacesSelectionForm";

const SiteSpacesSelectionFormContainer = () => {
  const dispatch = useAppDispatch();
  const { siteNature, soils } = useAppSelector(selectSpacesSelectionFormViewData);

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
        dispatch(stepReverted());
      }}
    />
  );
};

export default SiteSpacesSelectionFormContainer;
