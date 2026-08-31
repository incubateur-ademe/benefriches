import { generateSiteName } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectDerivedSiteData } from "@/features/create-site/core/selectors/createSite.selectors";

import SiteNameAndDescriptionForm, { FormValues } from "./SiteNameAndDescription";

function SiteNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
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
        dispatch(stepCompletionRequested({ stepId: "NAMING", answers: formData }));
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default SiteNameAndDescriptionFormContainer;
