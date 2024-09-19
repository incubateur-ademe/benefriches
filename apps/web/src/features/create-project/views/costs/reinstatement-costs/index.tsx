import { computeProjectReinstatementCosts, ReinstatementExpense } from "shared";
import {
  completeReinstatementExpenses,
  revertReinstatementExpenses,
} from "../../../application/createProject.reducer";
import ReinstatementExpensesForm, { FormValues } from "./ReinstatementCostsForm";

import { AppDispatch } from "@/app/application/store";
import {
  ProjectSite,
  ReconversionProjectCreationData,
} from "@/features/create-project/domain/project.types";
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

const mapProps = (
  dispatch: AppDispatch,
  projectData: Partial<ReconversionProjectCreationData>,
  siteData?: ProjectSite,
) => {
  const siteSoilsDistribution = siteData?.soilsDistribution ?? {};
  const projectSoilsDistribution = projectData.soilsDistribution ?? {};

  const {
    deimpermeabilization,
    sustainableSoilsReinstatement,
    remediation,
    demolition,
    asbestosRemoval,
  } = computeProjectReinstatementCosts(
    siteSoilsDistribution,
    projectSoilsDistribution,
    projectData.decontaminatedSurfaceArea ?? 0,
  );
  return {
    hasBuildings: hasBuildings(siteSoilsDistribution),
    hasImpermeableSoils:
      hasImpermeableSoils(siteSoilsDistribution) || hasMineralSoils(siteSoilsDistribution),
    hasProjectedDecontamination: !!(
      projectData.decontaminatedSurfaceArea && projectData.decontaminatedSurfaceArea > 0
    ),
    defaultValues: {
      deimpermeabilizationAmount: deimpermeabilization && Math.round(deimpermeabilization),
      sustainableSoilsReinstatementAmount:
        sustainableSoilsReinstatement && Math.round(sustainableSoilsReinstatement),
      remediationAmount: remediation && Math.round(remediation),
      demolitionAmount: demolition && Math.round(demolition),
      asbestosRemovalAmount: asbestosRemoval && Math.round(asbestosRemoval),
    },
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
  const projectData = useAppSelector((state) => state.projectCreation.projectData);

  return <ReinstatementExpensesForm {...mapProps(dispatch, projectData, siteData)} />;
}

export default ReinstatementExpensesFormContainer;
