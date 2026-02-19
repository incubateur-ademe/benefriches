import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { selectFricheActivity } from "@/features/create-site/core/selectors/createSite.selectors";
import { fricheActivityStepCompleted } from "@/features/create-site/core/steps/site-activity/siteActivity.actions";
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
        dispatch(stepReverted());
      }}
    />
  );
}

export default FricheActivityFormContainer;
