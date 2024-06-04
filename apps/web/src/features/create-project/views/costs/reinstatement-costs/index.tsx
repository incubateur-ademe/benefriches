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

const convertFormValuesToCosts = (amounts: FormValues): ReinstatementCosts["costs"] => {
  const reinstatementCosts: ReinstatementCosts["costs"] = [];
  if (amounts.asbestosRemovalAmount) {
    reinstatementCosts.push({ purpose: "asbestos_removal", amount: amounts.asbestosRemovalAmount });
  }

  if (amounts.deimpermeabilizationAmount) {
    reinstatementCosts.push({
      purpose: "deimpermeabilization",
      amount: amounts.deimpermeabilizationAmount,
    });
  }

  if (amounts.demolitionAmount) {
    reinstatementCosts.push({ purpose: "demolition", amount: amounts.demolitionAmount });
  }

  if (amounts.otherReinstatementCostAmount) {
    reinstatementCosts.push({
      purpose: "other_reinstatement",
      amount: amounts.otherReinstatementCostAmount,
    });
  }

  if (amounts.remediationAmount) {
    reinstatementCosts.push({ purpose: "remediation", amount: amounts.remediationAmount });
  }

  if (amounts.sustainableSoilsReinstatementAmount) {
    reinstatementCosts.push({
      purpose: "sustainable_soils_reinstatement",
      amount: amounts.sustainableSoilsReinstatementAmount,
    });
  }

  if (amounts.wasteCollectionAmount) {
    reinstatementCosts.push({ purpose: "waste_collection", amount: amounts.wasteCollectionAmount });
  }
  return reinstatementCosts;
};

const mapProps = (dispatch: AppDispatch, siteData?: ProjectSite) => {
  const soilsDistribution = siteData?.soilsDistribution ?? {};
  return {
    hasBuildings: hasBuildings(soilsDistribution),
    hasImpermeableSoils:
      hasImpermeableSoils(soilsDistribution) || hasMineralSoils(soilsDistribution),
    hasContaminatedSoils: siteData?.hasContaminatedSoils ?? false,
    onSubmit: (amounts: FormValues) => {
      const costs = convertFormValuesToCosts(amounts);
      const total = sumList(costs.map(({ amount }) => amount));
      dispatch(completeReinstatementCost({ costs, total }));
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
