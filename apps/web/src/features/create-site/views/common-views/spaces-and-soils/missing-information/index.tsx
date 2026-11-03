import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";
import MissingInformationIntroduction from "@/shared/views/components/MissingInformationIntroduction/MissingInformationIntroduction";

function SiteMissingInformationContainer() {
  const { onBack, onNext } = useCustomSiteForm();

  return <MissingInformationIntroduction onBack={onBack} onNext={onNext} />;
}

export default SiteMissingInformationContainer;
