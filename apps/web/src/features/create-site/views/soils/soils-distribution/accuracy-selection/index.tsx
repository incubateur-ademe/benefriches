import AccuracySelectionForm, { type FormValues } from "./AccuracySelectionForm";

import {
  goToStep,
  setSoilsDistribution,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { SoilType } from "@/shared/domain/soils";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const getDefaultSoilsDistribution = (surfaceArea?: number, soils?: SoilType[]) => {
  if (!surfaceArea || !soils || soils.length === 0) {
    return {};
  }
  const surface = surfaceArea / soils.length;
  return soils.reduce((distribution, soil) => ({ ...distribution, [soil]: surface }), {});
};

function SiteSoilsDistributionAccuracySelectionContainer() {
  const dispatch = useAppDispatch();
  const { soils, surfaceArea } = useAppSelector((state) => state.siteCreation.siteData);

  const onSubmit = ({ accuracy }: FormValues) => {
    if (accuracy === "percentage") {
      dispatch(goToStep(SiteCreationStep.SOILS_SURFACE_AREAS_BY_PERCENTAGE));
    } else if (accuracy === "square_meters") {
      dispatch(goToStep(SiteCreationStep.SOILS_SURFACE_AREAS_BY_SQUARE_METERS));
    } else {
      dispatch(setSoilsDistribution(getDefaultSoilsDistribution(surfaceArea, soils)));
      dispatch(goToStep(SiteCreationStep.SOILS_SUMMARY));
    }
  };

  return <AccuracySelectionForm onSubmit={onSubmit} />;
}

export default SiteSoilsDistributionAccuracySelectionContainer;
