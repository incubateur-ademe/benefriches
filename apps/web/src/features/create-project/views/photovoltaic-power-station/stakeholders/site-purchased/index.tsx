import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import SitePurchasedForm, { FormValues } from "./SitePurchasedForm";

function SitePurchasedFormContainer() {
  const { onBack, onRequestStepCompletion, selectSitePurchasedViewData } = useRenewableEnergyForm();
  const { isCurrentUserSiteOwner, initialValues, siteOwnerName } = useAppSelector(
    selectSitePurchasedViewData,
  );

  const onSubmit = (data: FormValues) => {
    onRequestStepCompletion({
      stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
      answers: { willSiteBePurchased: data.willSiteBePurchased === "yes" },
    });
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
