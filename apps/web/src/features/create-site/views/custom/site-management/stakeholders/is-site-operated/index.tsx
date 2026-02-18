import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { isSiteOperatedStepCompleted } from "@/features/create-site/core/actions/siteManagement.actions";
import { selectIsSiteOperatedFormViewData } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import IsSiteOperatedForm, { type FormValues } from "./IsSiteOperatedForm";

const mapInitialValues = (isSiteOperated: boolean | undefined): FormValues => {
  if (isSiteOperated === undefined) {
    return { isSiteOperated: null };
  }
  return {
    isSiteOperated: isSiteOperated ? "yes" : "no",
  };
};

function IsSiteOperatedFormContainer() {
  const { isSiteOperated, siteNature } = useAppSelector(selectIsSiteOperatedFormViewData);
  const dispatch = useAppDispatch();

  const onSubmit = ({ isSiteOperated }: FormValues) => {
    dispatch(isSiteOperatedStepCompleted({ isSiteOperated: isSiteOperated === "yes" }));
  };

  const onBack = () => {
    dispatch(stepReverted());
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
