import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import UrbanZoneManagementIntroduction from "./UrbanZoneManagementIntroduction";

function ManagementIntroductionContainer() {
  const { onBack, onNext } = useUrbanZoneSiteForm();

  return <UrbanZoneManagementIntroduction onNext={onNext} onBack={onBack} />;
}

export default ManagementIntroductionContainer;
