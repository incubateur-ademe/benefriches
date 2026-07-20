import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import SitePurchasedForm, {
  FormValues,
} from "@/features/create-project/views/photovoltaic-power-station/stakeholders/site-purchased/SitePurchasedForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectSitePurchasedViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function SitePurchasedFormContainer() {
  const dispatch = useAppDispatch();
  const { isCurrentUserSiteOwner, initialValues, siteOwnerName } = useAppSelector(
    selectSitePurchasedViewData,
  );

  const onSubmit = (data: FormValues) => {
    dispatch(
      updateProjectFormRenewableEnergyActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
        answers: { willSiteBePurchased: data.willSiteBePurchased === "yes" },
      }),
    );
  };

  const onBack = () => {
    dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
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
