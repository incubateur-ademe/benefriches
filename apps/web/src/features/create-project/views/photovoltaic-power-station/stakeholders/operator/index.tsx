import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { ProjectStakeholder } from "@/features/create-project/core/project.types";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVOperatorViewData } from "@/features/create-project/core/renewable-energy/step-handlers/stakeholders/stakeholders-future-operator/stakeholdersFutureOperator.selector";
import { UserStructure } from "@/features/onboarding/core/user";

import FutureOperatorForm, { FormValues } from "./FutureOperatorForm";

const mapInitialValues = (
  futureOperator: ProjectStakeholder | undefined,
  currentUser: UserStructure | undefined,
): FormValues | undefined => {
  if (!futureOperator || !currentUser) return undefined;

  if (
    futureOperator.name === currentUser.name &&
    futureOperator.structureType === currentUser.type
  ) {
    return { structureOption: "user_structure", otherStructureName: undefined };
  }
  return { otherStructureName: futureOperator.name, structureOption: "other_structure" };
};

function FutureOperatorFormContainer() {
  const dispatch = useAppDispatch();
  const { currentUser, initialValue } = useAppSelector(selectPVOperatorViewData);

  const onSubmit = (data: FormValues) => {
    const futureOperator: ProjectStakeholder =
      data.structureOption === "user_structure"
        ? {
            structureType: currentUser?.type ?? "company",
            name: currentUser?.name ?? "Structure non renseignée",
          }
        : {
            name: data.otherStructureName,
            structureType: "company",
          };
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
        answers: { futureOperator },
      }),
    );
  };

  const onBack = () => {
    dispatch(previousStepRequested());
  };

  return (
    <FutureOperatorForm
      initialValues={mapInitialValues(initialValue, currentUser)}
      userStructureType={currentUser?.type ?? "company"}
      userStructureName={currentUser?.name ?? "Structure non renseignée"}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default FutureOperatorFormContainer;
