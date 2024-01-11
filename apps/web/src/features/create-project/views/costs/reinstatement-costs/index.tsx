import {
  goToStep,
  ProjectCreationStep,
  setReinstatementCost,
} from "../../../application/createProject.reducer";
import ReinstatementsCostsForm, { FormValues } from "./ReinstatementCostsForm";

import { ProjectSite } from "@/features/create-project/domain/project.types";
import { SoilType } from "@/shared/domain/soils";
import { sumObjectValues } from "@/shared/services/sum/sum";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const hasBuildings = (soilsSurfaceAreas: ProjectSite["soilsSurfaceAreas"]) =>
  soilsSurfaceAreas[SoilType.BUILDINGS] ? soilsSurfaceAreas[SoilType.BUILDINGS] > 0 : false;
const hasImpermeableSoils = (soilsSurfaceAreas: ProjectSite["soilsSurfaceAreas"]) =>
  soilsSurfaceAreas[SoilType.IMPERMEABLE_SOILS]
    ? soilsSurfaceAreas[SoilType.IMPERMEABLE_SOILS] > 0
    : false;
const hasMineralSoils = (soilsSurfaceAreas: ProjectSite["soilsSurfaceAreas"]) =>
  soilsSurfaceAreas[SoilType.MINERAL_SOIL] ? soilsSurfaceAreas[SoilType.MINERAL_SOIL] > 0 : false;

const mapProps = (dispatch: AppDispatch, siteData?: ProjectSite) => {
  const soilsSurfaceAreas = siteData?.soilsSurfaceAreas ?? {};
  return {
    hasBuildings: hasBuildings(soilsSurfaceAreas),
    hasImpermeableSoils:
      hasImpermeableSoils(soilsSurfaceAreas) || hasMineralSoils(soilsSurfaceAreas),
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
