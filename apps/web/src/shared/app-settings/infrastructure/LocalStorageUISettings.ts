import { AppSettings, DEFAULT_APP_SETTINGS } from "../domain/appSettings";
import { AppSettingsGateway } from "../domain/AppSettingsGateway";

export const APP_SETTINGS_STORAGE_KEY = "benefriches/app-settings";

export class LocalStorageAppSettings implements AppSettingsGateway {
  getAll(): AppSettings {
    const fromLocalStorage = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);

    const appSettings = fromLocalStorage
      ? (JSON.parse(fromLocalStorage) as AppSettings)
      : DEFAULT_APP_SETTINGS;

    return appSettings;
  }

  setShouldDisplayFormsNotice(value: boolean) {
    const appSettings = this.getAll();

    localStorage.setItem(
      APP_SETTINGS_STORAGE_KEY,
      JSON.stringify({ ...appSettings, shouldDisplayFormsNotice: value }),
    );
  }
}
