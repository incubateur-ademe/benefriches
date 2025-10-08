import {
  getUrbanProjectAvailableStakeholders,
  getUrbanProjectAvailableLocalAuthoritiesStakeholders,
} from "@/features/create-project/core/urban-project-beta/stakeholders.selectors";
import { requestStepCompletion } from "@/features/create-project/core/urban-project-beta/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import StakeholderForm from "@/features/create-project/views/common-views/stakeholder-form";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

import { useStepBack } from "../../useStepBack";

function DeveloperFormContainer() {
  const dispatch = useAppDispatch();
  const availableStakeholdersList = useAppSelector(getUrbanProjectAvailableStakeholders);
  const availableLocalAuthoritiesStakeholders = useAppSelector(
    getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  );
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER"),
  );

  const onBack = useStepBack();
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
      initialValues={stepAnswers?.projectDeveloper}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
            answers: { projectDeveloper: formData },
          }),
        );
      }}
      onBack={onBack}
    />
  );
}

export default DeveloperFormContainer;
