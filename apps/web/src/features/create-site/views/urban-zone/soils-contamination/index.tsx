import { useAppSelector } from "@/app/hooks/store.hooks";
import SoilContaminationForm from "@/features/create-site/views/friche/soil-contamination/SoilContaminationForm";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

function SoilsContaminationContainer() {
  const { onBack, onRequestStepCompletion, selectSoilsContaminationViewData } =
    useUrbanZoneSiteForm();
  const { siteSurfaceArea, initialValues } = useAppSelector(selectSoilsContaminationViewData);

  return (
    <SoilContaminationForm
      title="Les sols de la zone sont-ils pollués ?"
      initialValues={initialValues}
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={({ hasContaminatedSoils, contaminatedSoilSurface }) => {
        onRequestStepCompletion({
          stepId: "URBAN_ZONE_SOILS_CONTAMINATION",
          answers: { hasContaminatedSoils, contaminatedSoilSurface },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default SoilsContaminationContainer;
