import {
  computeProjectReinstatementExpenses,
  ReinstatementExpense,
  SoilsDistribution,
} from "shared";

import ReinstatementExpensesForm, { FormValues } from "./ReinstatementExpensesForm";
import { mapFormValuesToReinstatementExpenses, mapInitialValues } from "./mappers";

type Props = {
  preEnteredData?: ReinstatementExpense[];
  onSubmit: (data: ReinstatementExpense[]) => void;
  onBack: () => void;
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
  decontaminatedSurfaceArea: number;
};

function ReinstatementExpensesFormContainer({
  onBack,
  onSubmit,
  preEnteredData,
  siteSoilsDistribution,
  projectSoilsDistribution,
  decontaminatedSurfaceArea,
}: Props) {
  const hasProjectedDecontamination = !!(
    decontaminatedSurfaceArea && decontaminatedSurfaceArea > 0
  );

  const initialValues = mapInitialValues(
    preEnteredData,
    computeProjectReinstatementExpenses(
      siteSoilsDistribution,
      projectSoilsDistribution,
      decontaminatedSurfaceArea,
    ),
  );

  return (
    <ReinstatementExpensesForm
      onBack={onBack}
      onSubmit={(data: FormValues) => {
        onSubmit(mapFormValuesToReinstatementExpenses(data));
      }}
      initialValues={initialValues}
      hasProjectedDecontamination={hasProjectedDecontamination}
    />
  );
}

export default ReinstatementExpensesFormContainer;
