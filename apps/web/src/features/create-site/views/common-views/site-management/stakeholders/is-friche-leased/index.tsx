import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectDerivedSiteData } from "@/features/create-site/core/selectors/createSite.selectors";

import IsFricheLeasedForm, { FormValues } from "./IsFricheLeasedForm";

const mapInitialValues = (isFricheLeased: boolean | undefined): FormValues => {
  if (isFricheLeased === undefined) {
    return { isFricheLeased: null };
  }
  return {
    isFricheLeased: isFricheLeased ? "yes" : "no",
  };
};

function IsFricheLeasedFormContainer() {
  const dispatch = useAppDispatch();
  const isFricheLeased = useAppSelector((state) => selectDerivedSiteData(state).isFricheLeased);

  const onSubmit = ({ isFricheLeased }: FormValues) => {
    dispatch(
      stepCompletionRequested({
        stepId: "IS_FRICHE_LEASED",
        answers: { isFricheLeased: isFricheLeased === "yes" },
      }),
    );
  };

  const onBack = () => {
    dispatch(previousStepRequested());
  };

  return (
    <IsFricheLeasedForm
      initialValues={mapInitialValues(isFricheLeased)}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default IsFricheLeasedFormContainer;
