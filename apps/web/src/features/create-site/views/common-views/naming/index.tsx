import { generateSiteName } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteNameAndDescriptionForm, { FormValues } from "./SiteNameAndDescription";

function SiteNameAndDescriptionFormContainer() {
  const { onBack, onRequestStepCompletion, selectDerivedSiteData } = useCustomSiteForm();
  const siteData = useAppSelector(selectDerivedSiteData);

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
            urbanZone: siteData.urbanZoneType,
          }),
        description: siteData.description ?? "",
      }}
      onSubmit={(formData: FormValues) => {
        onRequestStepCompletion({ stepId: "NAMING", answers: formData });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default SiteNameAndDescriptionFormContainer;
