import { ReinstatementExpense } from "shared";
import {
  completeReinstatementExpenses,
  revertReinstatementExpenses,
} from "../../../application/createProject.reducer";
import ReinstatementExpensesForm, { FormValues } from "./ReinstatementCostsForm";

import { AppDispatch } from "@/app/application/store";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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

const mapProps = (dispatch: AppDispatch, siteData?: ProjectSite) => {
  const soilsDistribution = siteData?.soilsDistribution ?? {};
  return {
    hasBuildings: hasBuildings(soilsDistribution),
    hasImpermeableSoils:
      hasImpermeableSoils(soilsDistribution) || hasMineralSoils(soilsDistribution),
    hasContaminatedSoils: siteData?.hasContaminatedSoils ?? false,
    onSubmit: (amounts: FormValues) => {
      const expenses = convertFormValuesToExpenses(amounts);
      dispatch(completeReinstatementExpenses(expenses));
    },
    onBack: () => {
      dispatch(revertReinstatementExpenses());
    },
  };
};

function ReinstatementExpensesFormContainer() {
  const dispatch = useAppDispatch();

  const siteData = useAppSelector((state) => state.projectCreation.siteData);

  return <ReinstatementExpensesForm {...mapProps(dispatch, siteData)} />;
}

export default ReinstatementExpensesFormContainer;
