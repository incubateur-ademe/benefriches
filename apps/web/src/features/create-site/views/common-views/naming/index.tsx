import { generateSiteName } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { namingStepCompleted } from "@/features/create-site/core/steps/naming/naming.actions";

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
