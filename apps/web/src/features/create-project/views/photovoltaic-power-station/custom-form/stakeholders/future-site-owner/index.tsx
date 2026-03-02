import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { ProjectStakeholderStructure } from "@/features/create-project/core/project.types";
import { completeFutureSiteOwner } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPVFutureSiteOwnerViewData } from "@/features/create-project/core/renewable-energy/selectors/stakeholders.selectors";
import StakeholderForm from "@/shared/views/project-form/common/stakeholder-form";

function FutureOwnerFormContainer() {
  const dispatch = useAppDispatch();
  const { availableStakeholdersList, availableLocalAuthoritiesStakeholders } = useAppSelector(
    selectPVFutureSiteOwnerViewData,
  );

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(completeFutureSiteOwner(data));
  };

  const onBack = () => {
    dispatch(stepReverted());
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
