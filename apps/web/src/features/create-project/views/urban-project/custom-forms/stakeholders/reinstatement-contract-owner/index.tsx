import {
  getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  getUrbanProjectAvailableStakeholders,
} from "@/features/create-project/application/urban-project/stakeholders.selectors";
import {
  stakeholderReinstatementContractOwnerCompleted,
  stakeholderReinstatementContractOwnerReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { ProjectStakeholderStructure } from "@/features/create-project/domain/project.types";
import StakeholderForm from "@/features/create-project/views/common-views/stakeholder-form";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

function SiteReinstatementContractOwnerFormContainer() {
  const dispatch = useAppDispatch();

  const availableStakeholdersList = useAppSelector(getUrbanProjectAvailableStakeholders);
  const availableLocalAuthoritiesStakeholders = useAppSelector(
    getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  );

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(stakeholderReinstatementContractOwnerCompleted(data));
  };

  const onBack = () => {
    dispatch(stakeholderReinstatementContractOwnerReverted());
  };

  return (
    <StakeholderForm
      title="Qui sera le maître d'ouvrage des travaux de remise en état de la friche ?"
      instructions={
        <FormInfo>
          <p>
            Les travaux de remise en état incluent la désimperméabilisation des sols, la
            dépollution, l'enlèvement des déchets, la déconstruction, etc.
          </p>
        </FormInfo>
      }
      onSubmit={onSubmit}
      onBack={onBack}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
    />
  );
}

export default SiteReinstatementContractOwnerFormContainer;
