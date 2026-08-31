import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectFricheActivity } from "@/features/create-site/core/selectors/createSite.selectors";

import FricheActivityForm, { FormValues } from "./FricheActivityForm";

function FricheActivityFormContainer() {
  const dispatch = useAppDispatch();
  const fricheActivity = useAppSelector(selectFricheActivity);

  return (
    <FricheActivityForm
      initialValues={{ activity: fricheActivity }}
      onSubmit={(formData: FormValues) => {
        dispatch(
          stepCompletionRequested({ stepId: "FRICHE_ACTIVITY", answers: formData.activity }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default FricheActivityFormContainer;
