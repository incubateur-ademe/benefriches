import {
  isSiteOperatedStepCompleted,
  isSiteOperatedStepReverted,
} from "@/features/create-site/core/actions/siteManagement.actions";
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
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);
  const dispatch = useAppDispatch();

  const onSubmit = ({ isSiteOperated }: FormValues) => {
    dispatch(isSiteOperatedStepCompleted({ isSiteOperated: isSiteOperated === "yes" }));
  };

  const onBack = () => {
    dispatch(isSiteOperatedStepReverted());
  };

  return (
    <IsSiteOperatedForm
      initialValues={mapInitialValues(isSiteOperated)}
      siteNature={siteNature}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default IsSiteOperatedFormContainer;
