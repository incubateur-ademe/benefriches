import { generateSiteName } from "shared";

import { completeNaming } from "@/features/create-site/core/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { revertNamingStep } from "../../../core/actions/createSite.actions";
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
        dispatch(completeNaming(formData));
      }}
      onBack={() => {
        dispatch(revertNamingStep());
      }}
    />
  );
}

export default SiteNameAndDescriptionFormContainer;
