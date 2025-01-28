import { computeProjectReinstatementCosts, ReinstatementExpense, SoilsDistribution } from "shared";

import { ProjectSite } from "@/features/create-project/core/project.types";

import ReinstatementExpensesForm, { FormValues } from "./ReinstatementExpensesForm";
import { mapFormValuesToReinstatementExpenses, mapInitialValues } from "./mappers";

const hasBuildings = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.BUILDINGS ? soilsDistribution.BUILDINGS > 0 : false;
const hasImpermeableSoils = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.IMPERMEABLE_SOILS ? soilsDistribution.IMPERMEABLE_SOILS > 0 : false;
const hasMineralSoils = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.MINERAL_SOIL ? soilsDistribution.MINERAL_SOIL > 0 : false;

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
  const hasImpermeableOrMineralSoils =
    hasImpermeableSoils(siteSoilsDistribution) || hasMineralSoils(siteSoilsDistribution);
  const hasProjectedDecontamination = !!(
    decontaminatedSurfaceArea && decontaminatedSurfaceArea > 0
  );

  const initialValues = mapInitialValues(
    preEnteredData,
    computeProjectReinstatementCosts(
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
      hasBuildings={hasBuildings(siteSoilsDistribution)}
      hasProjectedDecontamination={hasProjectedDecontamination}
      hasImpermeableSoils={hasImpermeableOrMineralSoils}
    />
  );
}

export default ReinstatementExpensesFormContainer;
