import { generateSiteName } from "shared";

import { namingStepCompleted } from "@/features/create-site/core/actions/naming.actions";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteNameAndDescriptionForm, { FormValues } from "./SiteNameAndDescription";

function SiteNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return (
    <SiteNameAndDescriptionForm
      initialValues={{
        name:
          siteData.name ??
          generateSiteName({
            cityName: siteData.address?.city ?? "",
            nature: siteData.nature!,
            fricheActivity: siteData.fricheActivity,
            naturalAreaType: siteData.naturalAreaType,
          }),
        description: siteData.description ?? "",
      }}
      onSubmit={(formData: FormValues) => {
        dispatch(namingStepCompleted(formData));
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default SiteNameAndDescriptionFormContainer;
