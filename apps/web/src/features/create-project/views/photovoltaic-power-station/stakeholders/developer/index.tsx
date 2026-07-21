import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { ProjectStakeholderStructure } from "@/features/create-project/core/project.types";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVDeveloperViewData } from "@/features/create-project/core/renewable-energy/step-handlers/stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.selector";
import StakeholderForm from "@/features/create-project/views/project-form/common/stakeholder-form";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

function DeveloperFormContainer() {
  const dispatch = useAppDispatch();
  const { availableStakeholdersList, availableLocalAuthoritiesStakeholders } =
    useAppSelector(selectPVDeveloperViewData);

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: data },
      }),
    );
  };

  const onBack = () => {
    dispatch(previousStepRequested());
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
