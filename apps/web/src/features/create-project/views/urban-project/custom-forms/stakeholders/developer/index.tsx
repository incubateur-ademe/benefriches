import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { ProjectStakeholderStructure } from "@/features/create-project/core/project.types";
import { stakeholderProjectDeveloperCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import {
  getUrbanProjectAvailableStakeholders,
  getUrbanProjectAvailableLocalAuthoritiesStakeholders,
} from "@/features/create-project/core/urban-project/selectors/stakeholders.selectors";
import StakeholderForm from "@/features/create-project/views/common-views/stakeholder-form";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

function DeveloperFormContainer() {
  const dispatch = useAppDispatch();
  const availableStakeholdersList = useAppSelector(getUrbanProjectAvailableStakeholders);
  const availableLocalAuthoritiesStakeholders = useAppSelector(
    getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  );

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(stakeholderProjectDeveloperCompleted(data));
  };

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  return (
    <StakeholderForm
      title="Qui sera l'aménageur du site ?"
      instructions={
        <FormInfo>
          <p>
            L’aménageur est l’acteur qui va engager la reconversion du site. Le bilan économique de
            l’opération sera donc à sa charge.
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

export default DeveloperFormContainer;
