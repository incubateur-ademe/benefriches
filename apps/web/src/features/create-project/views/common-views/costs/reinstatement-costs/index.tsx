import { computeProjectReinstatementCosts, ReinstatementExpense, SoilsDistribution } from "shared";

import { ProjectSite } from "@/features/create-project/domain/project.types";

import ReinstatementExpensesForm, { FormValues } from "./ReinstatementCostsForm";

const hasBuildings = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.BUILDINGS ? soilsDistribution.BUILDINGS > 0 : false;
const hasImpermeableSoils = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.IMPERMEABLE_SOILS ? soilsDistribution.IMPERMEABLE_SOILS > 0 : false;
const hasMineralSoils = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.MINERAL_SOIL ? soilsDistribution.MINERAL_SOIL > 0 : false;

const convertFormValuesToExpenses = (amounts: FormValues): ReinstatementExpense[] => {
  const reinstatementExpenses: ReinstatementExpense[] = [];
  if (amounts.asbestosRemovalAmount) {
    reinstatementExpenses.push({
      purpose: "asbestos_removal",
      amount: amounts.asbestosRemovalAmount,
    });
  }

  if (amounts.deimpermeabilizationAmount) {
    reinstatementExpenses.push({
      purpose: "deimpermeabilization",
      amount: amounts.deimpermeabilizationAmount,
    });
  }

  if (amounts.demolitionAmount) {
    reinstatementExpenses.push({ purpose: "demolition", amount: amounts.demolitionAmount });
  }

  if (amounts.otherReinstatementExpenseAmount) {
    reinstatementExpenses.push({
      purpose: "other_reinstatement",
      amount: amounts.otherReinstatementExpenseAmount,
    });
  }

  if (amounts.remediationAmount) {
    reinstatementExpenses.push({ purpose: "remediation", amount: amounts.remediationAmount });
  }

  if (amounts.sustainableSoilsReinstatementAmount) {
    reinstatementExpenses.push({
      purpose: "sustainable_soils_reinstatement",
      amount: amounts.sustainableSoilsReinstatementAmount,
    });
  }

  if (amounts.wasteCollectionAmount) {
    reinstatementExpenses.push({
      purpose: "waste_collection",
      amount: amounts.wasteCollectionAmount,
    });
  }
  return reinstatementExpenses;
};

const getDefaultValues = (
  siteSoilsDistribution: Props["siteSoilsDistribution"],
  projectSoilsDistribution: Props["projectSoilsDistribution"],
  decontaminatedSurfaceArea: Props["decontaminatedSurfaceArea"],
) => {
  const {
    deimpermeabilization,
    sustainableSoilsReinstatement,
    remediation,
    demolition,
    asbestosRemoval,
  } = computeProjectReinstatementCosts(
    siteSoilsDistribution,
    projectSoilsDistribution,
    decontaminatedSurfaceArea,
  );

  return {
    deimpermeabilizationAmount: deimpermeabilization && Math.round(deimpermeabilization),
    sustainableSoilsReinstatementAmount:
      sustainableSoilsReinstatement && Math.round(sustainableSoilsReinstatement),
    remediationAmount: remediation && Math.round(remediation),
    demolitionAmount: demolition && Math.round(demolition),
    asbestosRemovalAmount: asbestosRemoval && Math.round(asbestosRemoval),
  };
};

type Props = {
  onSubmit: (data: ReinstatementExpense[]) => void;
  onBack: () => void;
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
  decontaminatedSurfaceArea: number;
};

function ReinstatementExpensesFormContainer({
  onBack,
  onSubmit,
  siteSoilsDistribution,
  projectSoilsDistribution,
  decontaminatedSurfaceArea,
}: Props) {
  const hasImpermeableOrMineralSoils =
    hasImpermeableSoils(siteSoilsDistribution) || hasMineralSoils(siteSoilsDistribution);
  const hasProjectedDecontamination = !!(
    decontaminatedSurfaceArea && decontaminatedSurfaceArea > 0
  );

  return (
    <ReinstatementExpensesForm
      onBack={onBack}
      onSubmit={(data: FormValues) => {
        onSubmit(convertFormValuesToExpenses(data));
      }}
      defaultValues={getDefaultValues(
        siteSoilsDistribution,
        projectSoilsDistribution,
        decontaminatedSurfaceArea,
      )}
      hasBuildings={hasBuildings(siteSoilsDistribution)}
      hasProjectedDecontamination={hasProjectedDecontamination}
      hasImpermeableSoils={hasImpermeableOrMineralSoils}
    />
  );
}

export default ReinstatementExpensesFormContainer;
