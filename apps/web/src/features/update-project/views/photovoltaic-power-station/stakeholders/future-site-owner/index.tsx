import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { ProjectStakeholderStructure } from "@/features/create-project/core/project.types";
import StakeholderForm from "@/features/create-project/views/project-form/common/stakeholder-form";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPVFutureSiteOwnerViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function FutureOwnerFormContainer() {
  const dispatch = useAppDispatch();
  const { availableStakeholdersList, availableLocalAuthoritiesStakeholders } = useAppSelector(
    selectPVFutureSiteOwnerViewData,
  );

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(
      updateProjectFormRenewableEnergyActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
        answers: { futureSiteOwner: data },
      }),
    );
  };

  const onBack = () => {
    dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
  };

  return (
    <StakeholderForm
      title="Qui sera le nouveau propriétaire du site ?"
      onSubmit={onSubmit}
      onBack={onBack}
      availableStakeholdersList={availableStakeholdersList.filter(
        ({ role }) => role !== "site_owner",
      )}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
    />
  );
}

export default FutureOwnerFormContainer;
