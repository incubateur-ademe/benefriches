import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { ProjectStakeholderStructure } from "@/features/create-project/core/project.types";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVReinstatementContractOwnerViewData } from "@/features/create-project/core/renewable-energy/selectors/stakeholders.selectors";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import StakeholderForm from "@/shared/views/project-form/common/stakeholder-form";

function SiteReinstatementContractOwnerFormContainer() {
  const dispatch = useAppDispatch();
  const { availableStakeholdersList, availableLocalAuthoritiesStakeholders } = useAppSelector(
    selectPVReinstatementContractOwnerViewData,
  );

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
        answers: { reinstatementContractOwner: data },
      }),
    );
  };

  const onBack = () => {
    dispatch(navigateToPrevious());
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
