import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { isFricheLeasedStepCompleted } from "@/features/create-site/core/actions/siteManagement.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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
  const isFricheLeased = useAppSelector((state) => state.siteCreation.siteData.isFricheLeased);

  const onSubmit = ({ isFricheLeased }: FormValues) => {
    dispatch(isFricheLeasedStepCompleted({ isFricheLeased: isFricheLeased === "yes" }));
  };

  const onBack = () => {
    dispatch(stepReverted());
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
