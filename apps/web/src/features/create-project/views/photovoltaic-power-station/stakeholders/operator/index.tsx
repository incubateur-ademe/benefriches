import {
  completeFutureOperator,
  revertFutureOperator,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import {
  getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  getRenewableEnergyProjectAvailableStakeholders,
} from "@/features/create-project/application/renewable-energy/stakeholders.selectors";
import { ProjectStakeholderStructure } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import StakeholderForm from "../../../common-views/stakeholder-form";

function SiteOperatorFormContainer() {
  const dispatch = useAppDispatch();
  const availableStakeholdersList = useAppSelector(getRenewableEnergyProjectAvailableStakeholders);
  const availableLocalAuthoritiesStakeholders = useAppSelector(
    getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  );

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(completeFutureOperator(data));
  };

  const onBack = () => {
    dispatch(revertFutureOperator());
  };

  return (
    <StakeholderForm
      title="Qui sera l’exploitant de la centrale photovoltaïque&nbsp;?"
      onSubmit={onSubmit}
      onBack={onBack}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
    />
  );
}

export default SiteOperatorFormContainer;
