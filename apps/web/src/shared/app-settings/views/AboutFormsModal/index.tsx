import { LocalStorageAppSettings } from "../../infrastructure/LocalStorageUISettings";
import AboutFormsModal from "./AboutFormsModal";

function AboutFormsModalContainer() {
  const localStorageAppSettings = new LocalStorageAppSettings();

  return (
    <AboutFormsModal
      shouldOpenModal={localStorageAppSettings.getAll().shouldDisplayFormsNotice}
      setShouldNotDisplayAgain={(value: boolean) => {
        localStorageAppSettings.setShouldDisplayFormsNotice(!value);
      }}
    />
  );
}

export default AboutFormsModalContainer;
