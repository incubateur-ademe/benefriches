import { AppSettings, DEFAULT_APP_SETTINGS } from "../domain/appSettings";
import { AppSettingsGateway } from "../domain/AppSettingsGateway";

export const APP_SETTINGS_STORAGE_KEY = "benefriches/app-settings/v0";

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

    const updatedAppSettings: AppSettings = {
      ...appSettings,
      shouldDisplayFormsNotice: value,
    };

    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(updatedAppSettings));
  }

  setShouldDisplayProjectsComparisonNotice(value: boolean) {
    const appSettings = this.getAll();

    const updatedAppSettings: AppSettings = {
      ...appSettings,
      shouldDisplayProjectsComparisonNotice: value,
    };

    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(updatedAppSettings));
  }

  setShouldDisplayImpactsNotice(value: boolean) {
    const appSettings = this.getAll();

    const updatedAppSettings: AppSettings = { ...appSettings, shouldDisplayImpactsNotice: value };

    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(updatedAppSettings));
  }

  setShouldDisplayMyProjectTourGuide(value: boolean) {
    const appSettings = this.getAll();

    const updatedAppSettings: AppSettings = {
      ...appSettings,
      shouldDisplayMyProjectTourGuide: value,
    };

    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(updatedAppSettings));
  }
}
