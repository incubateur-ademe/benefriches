import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectSoilsContaminationViewData } from "@/features/create-site/core/urban-zone/steps/contamination/soilsContamination.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";
import SoilContaminationForm from "@/features/create-site/views/custom/soil-contamination/SoilContaminationForm";

function SoilsContaminationContainer() {
  const dispatch = useAppDispatch();
  const { siteSurfaceArea, initialValues } = useAppSelector(selectSoilsContaminationViewData);

  return (
    <SoilContaminationForm
      title="Les sols de la zone sont-ils pollués ?"
      initialValues={initialValues}
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={({ hasContaminatedSoils, contaminatedSoilSurface }) => {
        dispatch(
          stepCompletionRequested({
            stepId: "URBAN_ZONE_SOILS_CONTAMINATION",
            answers: { hasContaminatedSoils, contaminatedSoilSurface },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default SoilsContaminationContainer;
