import IsFricheLeasedForm, { FormValues } from "./IsFricheLeasedForm";

import { revertIsFricheLeasedStep } from "@/features/create-site/application/createSite.actions";
import { completeIsFricheLeased } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function IsFricheLeasedFormContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = ({ isFricheLeased }: FormValues) => {
    dispatch(completeIsFricheLeased({ isFricheLeased: isFricheLeased === "yes" }));
  };

  const onBack = () => {
    dispatch(revertIsFricheLeasedStep());
  };

  return <IsFricheLeasedForm onSubmit={onSubmit} onBack={onBack} />;
}

export default IsFricheLeasedFormContainer;
