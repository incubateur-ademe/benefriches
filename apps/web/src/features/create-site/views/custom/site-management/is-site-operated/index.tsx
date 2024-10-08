import { revertIsSiteOperatedStep } from "@/features/create-site/application/createSite.actions";
import { completeIsSiteOperated } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import IsSiteOperatedForm, { FormValues } from "./IsSiteOperatedForm";

function IsSiteOperatedFormContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = ({ isSiteOperated }: FormValues) => {
    dispatch(completeIsSiteOperated({ isSiteOperated: isSiteOperated === "yes" }));
  };

  const onBack = () => {
    dispatch(revertIsSiteOperatedStep());
  };

  return <IsSiteOperatedForm onSubmit={onSubmit} onBack={onBack} />;
}

export default IsSiteOperatedFormContainer;
