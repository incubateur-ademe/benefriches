import AboutComparisonModal from "./AboutComparisonModal";

import { LocalStorageAppSettings } from "@/shared/app-settings/infrastructure/LocalStorageUISettings";

function AboutComparisonModalContainer({ isOpen }: { isOpen: boolean }) {
  const localStorageAppSettings = new LocalStorageAppSettings();

  const stopDisplayNotice = !localStorageAppSettings.getAll().shouldDisplayProjectsComparisonNotice;
  const shouldOpenModal = isOpen && !stopDisplayNotice;

  return (
    <AboutComparisonModal
      shouldOpenModal={shouldOpenModal}
      setShouldNotDisplayAgain={(value: boolean) => {
        localStorageAppSettings.setShouldDisplayProjectsComparisonNotice(!value);
      }}
    />
  );
}

export default AboutComparisonModalContainer;
