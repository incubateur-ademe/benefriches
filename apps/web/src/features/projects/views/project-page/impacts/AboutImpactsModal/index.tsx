import AboutImpactsModal from "./AboutImpactsModal";

import { LocalStorageAppSettings } from "@/shared/app-settings/infrastructure/LocalStorageUISettings";

function AboutImpactsModalContainer() {
  const localStorageAppSettings = new LocalStorageAppSettings();

  return (
    <AboutImpactsModal
      shouldOpenModal={localStorageAppSettings.getAll().shouldDisplayImpactsNotice}
      setShouldNotDisplayAgain={(value: boolean) => {
        localStorageAppSettings.setShouldDisplayImpactsNotice(!value);
      }}
    />
  );
}

export default AboutImpactsModalContainer;
