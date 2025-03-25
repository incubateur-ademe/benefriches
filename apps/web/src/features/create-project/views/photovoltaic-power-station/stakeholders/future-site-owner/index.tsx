import { ProjectStakeholderStructure } from "@/features/create-project/core/project.types";
import { completeFutureSiteOwner } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { futureSiteOwnerStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import {
  getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  getRenewableEnergyProjectAvailableStakeholders,
} from "@/features/create-project/core/renewable-energy/selectors/stakeholders.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import StakeholderForm from "../../../common-views/stakeholder-form";

function FutureOwnerFormContainer() {
  const dispatch = useAppDispatch();
  const availableStakeholdersList = useAppSelector(getRenewableEnergyProjectAvailableStakeholders);
  const availableLocalAuthoritiesStakeholders = useAppSelector(
    getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  );

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(completeFutureSiteOwner(data));
  };

  const onBack = () => {
    dispatch(futureSiteOwnerStepReverted());
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
