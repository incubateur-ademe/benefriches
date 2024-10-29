import {
  completeSitePurchase,
  revertWillSiteBePurchased,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SitePurchasedForm, { FormValues } from "./SitePurchasedForm";

function SitePurchasedFormContainer() {
  const dispatch = useAppDispatch();
  const siteOwner = useAppSelector((state) => state.projectCreation.siteData?.owner);

  const onSubmit = (data: FormValues) => {
    const willSiteBePurchased = data.willSiteBePurchased === "yes";
    dispatch(completeSitePurchase(willSiteBePurchased));
  };

  const onBack = () => {
    dispatch(revertWillSiteBePurchased());
  };

  return (
    <SitePurchasedForm onSubmit={onSubmit} onBack={onBack} currentOwnerName={siteOwner?.name} />
  );
}

export default SitePurchasedFormContainer;
