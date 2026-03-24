import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/demo/demoFactory";
import { selectSiteNatureViewData } from "@/features/create-site/core/demo/steps/site-nature/siteNature.selectors";

import SiteNatureForm, { FormValues } from "./SiteNatureForm";

function SiteNatureFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectSiteNatureViewData);

  return (
    <SiteNatureForm
      initialValues={initialValues}
      onSubmit={(data: FormValues) => {
        dispatch(
          stepCompletionRequested({
            stepId: "DEMO_SITE_NATURE_SELECTION",
            answers: data,
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default SiteNatureFormContainer;
