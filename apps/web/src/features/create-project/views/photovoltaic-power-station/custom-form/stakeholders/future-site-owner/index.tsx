import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { ProjectStakeholderStructure } from "@/features/create-project/core/project.types";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVFutureSiteOwnerViewData } from "@/features/create-project/core/renewable-energy/selectors/stakeholders.selectors";
import StakeholderForm from "@/shared/views/project-form/common/stakeholder-form";

function FutureOwnerFormContainer() {
  const dispatch = useAppDispatch();
  const { availableStakeholdersList, availableLocalAuthoritiesStakeholders } = useAppSelector(
    selectPVFutureSiteOwnerViewData,
  );

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
        answers: { futureSiteOwner: data },
      }),
    );
  };

  const onBack = () => {
    dispatch(navigateToPrevious());
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
