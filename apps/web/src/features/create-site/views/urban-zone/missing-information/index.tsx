import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";
import MissingInformationIntroduction from "@/shared/views/components/MissingInformationIntroduction/MissingInformationIntroduction";

function UrbanZoneMissingInformationContainer() {
  const { onBack, onNext } = useUrbanZoneSiteForm();

  return <MissingInformationIntroduction onBack={onBack} onNext={onNext} />;
}

export default UrbanZoneMissingInformationContainer;
