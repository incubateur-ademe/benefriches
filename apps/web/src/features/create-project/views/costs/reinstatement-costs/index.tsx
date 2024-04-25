import {
  completeReinstatementCost,
  revertReinstatementCost,
} from "../../../application/createProject.reducer";
import ReinstatementsCostsForm, { FormValues } from "./ReinstatementCostsForm";

import { AppDispatch } from "@/app/application/store";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import { sumObjectValues } from "@/shared/services/sum/sum";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const hasBuildings = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.BUILDINGS ? soilsDistribution.BUILDINGS > 0 : false;
const hasImpermeableSoils = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.IMPERMEABLE_SOILS ? soilsDistribution.IMPERMEABLE_SOILS > 0 : false;
const hasMineralSoils = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution.MINERAL_SOIL ? soilsDistribution.MINERAL_SOIL > 0 : false;

const mapProps = (dispatch: AppDispatch, siteData?: ProjectSite) => {
  const soilsDistribution = siteData?.soilsDistribution ?? {};
  return {
    hasBuildings: hasBuildings(soilsDistribution),
    hasImpermeableSoils:
      hasImpermeableSoils(soilsDistribution) || hasMineralSoils(soilsDistribution),
    hasContaminatedSoils: siteData?.hasContaminatedSoils ?? false,
    onSubmit: (amounts: FormValues) => {
      const totalCost = sumObjectValues(amounts);
      dispatch(completeReinstatementCost(totalCost));
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
