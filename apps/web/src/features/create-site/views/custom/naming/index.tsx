import { generateSiteName } from "shared";

import { namingStepCompleted } from "@/features/create-site/core/actions/naming.actions";
import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
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
            isFriche: siteData.isFriche ?? false,
            soils: siteData.soils,
            fricheActivity: siteData.fricheActivity,
          }),
        description: siteData.description ?? "",
      }}
      onSubmit={(formData: FormValues) => {
        dispatch(namingStepCompleted(formData));
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default SiteNameAndDescriptionFormContainer;
