import { completeSitePurchase } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { willSiteBePurchasedStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SitePurchasedForm, { FormValues } from "./SitePurchasedForm";

function SitePurchasedFormContainer() {
  const dispatch = useAppDispatch();
  const siteOwner = useAppSelector((state) => state.projectCreation.siteData?.owner);
  const initialValue = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject.creationData.willSiteBePurchased,
  );

  const onSubmit = (data: FormValues) => {
    const willSiteBePurchased = data.willSiteBePurchased === "yes";
    dispatch(completeSitePurchase(willSiteBePurchased));
  };

  const onBack = () => {
    dispatch(willSiteBePurchasedStepReverted());
  };

  return (
    <SitePurchasedForm
      initialValues={
        initialValue === undefined
          ? undefined
          : { willSiteBePurchased: initialValue ? "yes" : "no" }
      }
      onSubmit={onSubmit}
      onBack={onBack}
      currentOwnerName={siteOwner?.name}
    />
  );
}

export default SitePurchasedFormContainer;
