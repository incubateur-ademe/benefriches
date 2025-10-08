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

function SiteReinstatementContractOwnerFormContainer() {
  const dispatch = useAppDispatch();

  const availableStakeholdersList = useAppSelector(getUrbanProjectAvailableStakeholders);
  const availableLocalAuthoritiesStakeholders = useAppSelector(
    getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  );

  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"),
  );

  const onBack = useStepBack();

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
      initialValues={stepAnswers?.reinstatementContractOwner}
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
            answers: { reinstatementContractOwner: formData },
          }),
        );
      }}
      onBack={onBack}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
    />
  );
}

export default SiteReinstatementContractOwnerFormContainer;
