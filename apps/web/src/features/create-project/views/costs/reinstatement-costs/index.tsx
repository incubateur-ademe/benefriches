import {
  goToStep,
  ProjectCreationStep,
  setReinstatementCost,
} from "../../../application/createProject.reducer";
import ReinstatementsCostsForm, { FormValues } from "./ReinstatementCostsForm";

import { AppDispatch } from "@/app/application/store";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import { SoilType } from "@/shared/domain/soils";
import { sumObjectValues } from "@/shared/services/sum/sum";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const hasBuildings = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution[SoilType.BUILDINGS] ? soilsDistribution[SoilType.BUILDINGS] > 0 : false;
const hasImpermeableSoils = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution[SoilType.IMPERMEABLE_SOILS]
    ? soilsDistribution[SoilType.IMPERMEABLE_SOILS] > 0
    : false;
const hasMineralSoils = (soilsDistribution: ProjectSite["soilsDistribution"]) =>
  soilsDistribution[SoilType.MINERAL_SOIL] ? soilsDistribution[SoilType.MINERAL_SOIL] > 0 : false;

const mapProps = (dispatch: AppDispatch, siteData?: ProjectSite) => {
  const soilsDistribution = siteData?.soilsDistribution ?? {};
  return {
    hasBuildings: hasBuildings(soilsDistribution),
    hasImpermeableSoils:
      hasImpermeableSoils(soilsDistribution) || hasMineralSoils(soilsDistribution),
    hasContaminatedSoils: siteData?.hasContaminatedSoils ?? false,
    onSubmit: (amounts: FormValues) => {
      const totalCost = sumObjectValues(amounts);
      dispatch(setReinstatementCost(totalCost));
      dispatch(goToStep(ProjectCreationStep.COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION));
    },
  };
};

function ReinstatementCostsFormContainer() {
  const dispatch = useAppDispatch();

  const siteData = useAppSelector((state) => state.projectCreation.siteData);

  return <ReinstatementsCostsForm {...mapProps(dispatch, siteData)} />;
}

export default ReinstatementCostsFormContainer;
