import IsSiteWorkedForm, { FormValues } from "./IsSiteWorkedForm";

import { revertIsSiteWorkedStep } from "@/features/create-site/application/createSite.actions";
import { completeIsSiteWorked } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function IsSiteWorkedFormContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = ({ isSiteWorked }: FormValues) => {
    dispatch(completeIsSiteWorked({ isSiteWorked: isSiteWorked === "yes" }));
  };

  const onBack = () => {
    dispatch(revertIsSiteWorkedStep());
  };

  return <IsSiteWorkedForm onSubmit={onSubmit} onBack={onBack} />;
}

export default IsSiteWorkedFormContainer;
