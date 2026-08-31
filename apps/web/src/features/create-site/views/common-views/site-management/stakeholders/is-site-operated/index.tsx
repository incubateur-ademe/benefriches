import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectIsSiteOperatedFormViewData } from "@/features/create-site/core/steps/site-management/siteManagement.selectors";

import IsSiteOperatedForm, { type FormValues } from "./IsSiteOperatedForm";

const mapInitialValues = (isSiteOperated: boolean | undefined): FormValues => {
  if (isSiteOperated === undefined) {
    return { isSiteOperated: null };
  }
  return {
    isSiteOperated: isSiteOperated ? "yes" : "no",
  };
};

function IsSiteOperatedFormContainer() {
  const { isSiteOperated, siteNature } = useAppSelector(selectIsSiteOperatedFormViewData);
  const dispatch = useAppDispatch();

  const onSubmit = ({ isSiteOperated }: FormValues) => {
    dispatch(
      stepCompletionRequested({
        stepId: "IS_SITE_OPERATED",
        answers: { isSiteOperated: isSiteOperated === "yes" },
      }),
    );
  };

  const onBack = () => {
    dispatch(previousStepRequested());
  };

  return (
    <IsSiteOperatedForm
      initialValues={mapInitialValues(isSiteOperated)}
      siteNature={siteNature}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default IsSiteOperatedFormContainer;
