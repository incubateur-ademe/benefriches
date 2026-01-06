import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeSitePurchase } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectSitePurchasedViewData } from "@/features/create-project/core/renewable-energy/selectors/stakeholders.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SitePurchasedForm, { FormValues } from "./SitePurchasedForm";

function SitePurchasedFormContainer() {
  const dispatch = useAppDispatch();
  const { isCurrentUserSiteOwner, initialValues, siteOwnerName } = useAppSelector(
    selectSitePurchasedViewData,
  );

  const onSubmit = (data: FormValues) => {
    const willSiteBePurchased = data.willSiteBePurchased === "yes";
    dispatch(completeSitePurchase(willSiteBePurchased));
  };

  const onBack = () => {
    dispatch(stepReverted());
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
