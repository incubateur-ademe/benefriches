import SiteNamingIntroduction from "@/features/create-site/views/common-views/naming/introduction/SiteNamingIntroduction";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

function UrbanZoneNamingIntroductionContainer() {
  const { onBack, onNext } = useUrbanZoneSiteForm();

  return <SiteNamingIntroduction onNext={onNext} onBack={onBack} />;
}

export default UrbanZoneNamingIntroductionContainer;
