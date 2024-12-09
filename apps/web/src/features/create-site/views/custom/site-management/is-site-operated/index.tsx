import { revertIsSiteOperatedStep } from "@/features/create-site/application/createSite.actions";
import { completeIsSiteOperated } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import IsSiteOperatedForm, { FormValues } from "./IsSiteOperatedForm";

const mapInitialValues = (isSiteOperated: boolean | undefined): FormValues => {
  if (isSiteOperated === undefined) {
    return { isSiteOperated: null };
  }
  return {
    isSiteOperated: isSiteOperated ? "yes" : "no",
  };
};

function IsSiteOperatedFormContainer() {
  const isSiteOperated = useAppSelector((state) => state.siteCreation.siteData.isSiteOperated);
  const dispatch = useAppDispatch();

  const onSubmit = ({ isSiteOperated }: FormValues) => {
    dispatch(completeIsSiteOperated({ isSiteOperated: isSiteOperated === "yes" }));
  };

  const onBack = () => {
    dispatch(revertIsSiteOperatedStep());
  };

  return (
    <IsSiteOperatedForm
      initialValues={mapInitialValues(isSiteOperated)}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default IsSiteOperatedFormContainer;
