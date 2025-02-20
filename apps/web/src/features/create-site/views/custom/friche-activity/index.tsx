import { completeFricheActivity } from "@/features/create-site/core/createSite.reducer";
import { selectFricheActivity } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { revertFricheActivityStep } from "../../../core/actions/createSite.actions";
import FricheActivityForm, { FormValues } from "./FricheActivityForm";

function FricheActivityFormContainer() {
  const dispatch = useAppDispatch();
  const fricheActivity = useAppSelector(selectFricheActivity);

  return (
    <FricheActivityForm
      initialValues={{ activity: fricheActivity }}
      onSubmit={(formData: FormValues) => {
        dispatch(completeFricheActivity(formData.activity));
      }}
      onBack={() => {
        dispatch(revertFricheActivityStep());
      }}
    />
  );
}

export default FricheActivityFormContainer;
