import { useAppSelector } from "@/app/hooks/store.hooks";
import SiteNameAndDescriptionForm from "@/features/create-site/views/common-views/naming/SiteNameAndDescription";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

function UrbanZoneNamingContainer() {
  const { onBack, onRequestStepCompletion, selectUrbanZoneNamingViewData } = useUrbanZoneSiteForm();
  const { initialValues } = useAppSelector(selectUrbanZoneNamingViewData);

  return (
    <SiteNameAndDescriptionForm
      initialValues={initialValues}
      onSubmit={({ name, description }) => {
        onRequestStepCompletion({
          stepId: "URBAN_ZONE_NAMING",
          answers: { name, description },
        });
      }}
      onBack={onBack}
    />
  );
}

export default UrbanZoneNamingContainer;
