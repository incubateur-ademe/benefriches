import { revertIsFricheLeasedStep } from "@/features/create-site/application/createSite.actions";
import { completeIsFricheLeased } from "@/features/create-site/application/createSite.reducer";
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
    dispatch(completeIsFricheLeased({ isFricheLeased: isFricheLeased === "yes" }));
  };

  const onBack = () => {
    dispatch(revertIsFricheLeasedStep());
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
