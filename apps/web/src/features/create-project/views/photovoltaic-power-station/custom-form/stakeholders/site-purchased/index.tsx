import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectSitePurchasedViewData } from "@/features/create-project/core/renewable-energy/step-handlers/stakeholders/stakeholders-site-purchase/stakeholdersSitePurchase.selector";

import SitePurchasedForm, { FormValues } from "./SitePurchasedForm";

function SitePurchasedFormContainer() {
  const dispatch = useAppDispatch();
  const { isCurrentUserSiteOwner, initialValues, siteOwnerName } = useAppSelector(
    selectSitePurchasedViewData,
  );

  const onSubmit = (data: FormValues) => {
    dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
        answers: { willSiteBePurchased: data.willSiteBePurchased === "yes" },
      }),
    );
  };

  const onBack = () => {
    dispatch(navigateToPrevious());
  };

  return (
    <SitePurchasedForm
      initialValues={
        initialValues
          ? { willSiteBePurchased: initialValues.willSiteBePurchased ? "yes" : "no" }
          : undefined
      }
      onSubmit={onSubmit}
      onBack={onBack}
      currentOwnerName={siteOwnerName}
      isCurrentUserSiteOwner={isCurrentUserSiteOwner}
    />
  );
}

export default SitePurchasedFormContainer;
