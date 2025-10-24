import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import ReinstatementsExpensesForm from "@/shared/views/project-form/common/expenses/reinstatement/ReinstatementExpensesForm";
import {
  mapFormValuesToReinstatementExpenses,
  mapReinstatementExpensesToFormValues,
} from "@/shared/views/project-form/common/expenses/reinstatement/mappers";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ReinstatementExpensesFormContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers, selectSiteSoilsDistribution } =
    useProjectForm();

  const reinstatementExpenses = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_EXPENSES_REINSTATEMENT"),
  )?.reinstatementExpenses;
  const decontaminatedSurfaceArea = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA"),
  )?.decontaminatedSurfaceArea;
  const siteSoilsDistribution = useAppSelector(selectSiteSoilsDistribution);

  return (
    <ReinstatementsExpensesForm
      onBack={onBack}
      onSubmit={(data) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
          answers: {
            reinstatementExpenses: mapFormValuesToReinstatementExpenses(data),
          },
        });
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
