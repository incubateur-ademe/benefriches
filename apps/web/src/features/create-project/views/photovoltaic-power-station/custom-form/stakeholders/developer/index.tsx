import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { ProjectStakeholderStructure } from "@/features/create-project/core/project.types";
import { completeProjectDeveloper } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPVDeveloperViewData } from "@/features/create-project/core/renewable-energy/selectors/stakeholders.selectors";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import StakeholderForm from "@/shared/views/project-form/common/stakeholder-form//";

function DeveloperFormContainer() {
  const dispatch = useAppDispatch();
  const { availableStakeholdersList, availableLocalAuthoritiesStakeholders } =
    useAppSelector(selectPVDeveloperViewData);

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(completeProjectDeveloper(data));
  };

  const onBack = () => {
    dispatch(stepReverted());
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
          <p>
            L’aménageur peut aussi être l’exploitant du site ; la question sera posée dans l’étape
            suivante.
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
