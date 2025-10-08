import { selectSiteSoilsDistribution } from "@/features/create-project/core/createProject.selectors";
import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import ReinstatementsExpensesForm from "@/features/create-project/views/common-views/expenses/reinstatement/ReinstatementExpensesForm";
import {
  mapFormValuesToReinstatementExpenses,
  mapReinstatementExpensesToFormValues,
} from "@/features/create-project/views/common-views/expenses/reinstatement/mappers";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";

function ReinstatementExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const { reinstatementExpenses } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_EXPENSES_REINSTATEMENT")) ?? {};
  const { decontaminatedSurfaceArea } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA")) ?? {};
  const siteSoilsDistribution = useAppSelector(selectSiteSoilsDistribution);

  const onBack = useStepBack();
  return (
    <ReinstatementsExpensesForm
      onBack={onBack}
      onSubmit={(data) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
            answers: {
              reinstatementExpenses: mapFormValuesToReinstatementExpenses(data),
            },
          }),
        );
      }}
      hasBuildings={Boolean(siteSoilsDistribution.BUILDINGS && siteSoilsDistribution.BUILDINGS > 0)}
      hasProjectedDecontamination={Boolean(
        decontaminatedSurfaceArea && decontaminatedSurfaceArea > 0,
      )}
      hasImpermeableSoils={
        Boolean(
          siteSoilsDistribution.IMPERMEABLE_SOILS && siteSoilsDistribution.IMPERMEABLE_SOILS > 0,
        ) || Boolean(siteSoilsDistribution.MINERAL_SOIL && siteSoilsDistribution.MINERAL_SOIL > 0)
      }
      initialValues={
        reinstatementExpenses
          ? mapReinstatementExpensesToFormValues(reinstatementExpenses)
          : undefined
      }
    />
  );
}

export default ReinstatementExpensesFormContainer;
