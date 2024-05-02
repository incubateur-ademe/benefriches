import {
  completeReinstatementCost,
  revertReinstatementCost,
} from "../../../application/createProject.reducer";
import ReinstatementsCostsForm, { FormValues } from "./ReinstatementCostsForm";

import { AppDispatch } from "@/app/application/store";
import { ProjectSite, ReinstatementCosts } from "@/features/create-project/domain/project.types";
import { sumList } from "@/shared/services/sum/sum";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const hasBuildings = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.BUILDINGS ? soilsDistribution.BUILDINGS > 0 : false;
const hasImpermeableSoils = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.IMPERMEABLE_SOILS ? soilsDistribution.IMPERMEABLE_SOILS > 0 : false;
const hasMineralSoils = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.MINERAL_SOIL ? soilsDistribution.MINERAL_SOIL > 0 : false;

const convertFormValuesToExpenses = (amounts: FormValues) => {
  const expenses: ReinstatementCosts["expenses"] = [];
  if (amounts.asbestosRemovalAmount) {
    expenses.push({ purpose: "abestos_removal", amount: amounts.asbestosRemovalAmount });
  }

  if (amounts.deimpermeabilizationAmount) {
    expenses.push({ purpose: "deimpermeabilization", amount: amounts.deimpermeabilizationAmount });
  }

  if (amounts.demolitionAmount) {
    expenses.push({ purpose: "demolition", amount: amounts.demolitionAmount });
  }

  if (amounts.otherReinstatementCostAmount) {
    expenses.push({ purpose: "other_reinstatement", amount: amounts.otherReinstatementCostAmount });
  }

  if (amounts.remediationAmount) {
    expenses.push({ purpose: "remediation", amount: amounts.remediationAmount });
  }

  if (amounts.sustainableSoilsReinstatementAmount) {
    expenses.push({
      purpose: "sustainable_soils_reinstatement",
      amount: amounts.sustainableSoilsReinstatementAmount,
    });
  }

  if (amounts.wasteCollectionAmount) {
    expenses.push({ purpose: "waste_collection", amount: amounts.wasteCollectionAmount });
  }
  return expenses;
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
      const total = sumList(expenses.map(({ amount }) => amount));
      dispatch(completeReinstatementCost({ expenses, total }));
    },
    onBack: () => {
      dispatch(revertReinstatementCost());
    },
  };
};

function ReinstatementCostsFormContainer() {
  const dispatch = useAppDispatch();

  const siteData = useAppSelector((state) => state.projectCreation.siteData);

  return <ReinstatementsCostsForm {...mapProps(dispatch, siteData)} />;
}

export default ReinstatementCostsFormContainer;
