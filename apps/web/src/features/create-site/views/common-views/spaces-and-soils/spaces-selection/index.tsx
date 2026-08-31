import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectSpacesSelectionFormViewData } from "@/features/create-site/core/steps/spaces/spaces.selectors";

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
        dispatch(
          stepCompletionRequested({
            stepId: "SPACES_SELECTION",
            answers: { soils: formData.soils },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
};

export default SiteSpacesSelectionFormContainer;
