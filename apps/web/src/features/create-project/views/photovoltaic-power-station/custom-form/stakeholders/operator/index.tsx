import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { ProjectStakeholder } from "@/features/create-project/core/project.types";
import { futureOperatorCompleted } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectCreationData } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { UserStructure } from "@/features/onboarding/core/user";
import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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
  const currentUser = useAppSelector(selectCurrentUserStructure);
  const initialValue = useAppSelector(selectCreationData).futureOperator;

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
    dispatch(futureOperatorCompleted(futureOperator));
  };

  const onBack = () => {
    dispatch(stepReverted());
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
