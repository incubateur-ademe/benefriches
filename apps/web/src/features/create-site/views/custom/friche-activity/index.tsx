import {
  fricheActivityStepCompleted,
  fricheActivityStepReverted,
} from "@/features/create-site/core/actions/introduction.actions";
import { selectFricheActivity } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import FricheActivityForm, { FormValues } from "./FricheActivityForm";

function FricheActivityFormContainer() {
  const dispatch = useAppDispatch();
  const fricheActivity = useAppSelector(selectFricheActivity);

  return (
    <FricheActivityForm
      initialValues={{ activity: fricheActivity }}
      onSubmit={(formData: FormValues) => {
        dispatch(fricheActivityStepCompleted(formData.activity));
      }}
      onBack={() => {
        dispatch(fricheActivityStepReverted());
      }}
    />
  );
}

export default FricheActivityFormContainer;
