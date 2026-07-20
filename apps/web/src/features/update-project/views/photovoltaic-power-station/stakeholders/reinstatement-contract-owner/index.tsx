import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { ProjectStakeholderStructure } from "@/features/create-project/core/project.types";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPVReinstatementContractOwnerViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import StakeholderForm from "@/shared/views/project-form/common/stakeholder-form";

function SiteReinstatementContractOwnerFormContainer() {
  const dispatch = useAppDispatch();
  const { availableStakeholdersList, availableLocalAuthoritiesStakeholders } = useAppSelector(
    selectPVReinstatementContractOwnerViewData,
  );

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(
      updateProjectFormRenewableEnergyActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
        answers: { reinstatementContractOwner: data },
      }),
    );
  };

  const onBack = () => {
    dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
  };

  return (
    <StakeholderForm
      title="Qui sera le maître d'ouvrage des travaux de remise en état de la friche ?"
      instructions={
        <FormInfo>
          <span className="title">La remise en état du site, kézako ?</span>

          <p>
            Les travaux de remise en état incluent la désimperméabilisation des sols, la
            dépollution, l’enlèvement des déchets, la déconstruction, etc.
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
