import {
  completeFutureSiteOwner,
  revertFutureSiteOwner,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import {
  getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  getRenewableEnergyProjectAvailableStakeholders,
} from "@/features/create-project/application/renewable-energy/stakeholders.selectors";
import { ProjectStakeholderStructure } from "@/features/create-project/domain/project.types";
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
    dispatch(revertFutureSiteOwner());
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
