import { AppSettingsGateway } from "../core/AppSettingsGateway";
import { AppSettings, DEFAULT_APP_SETTINGS } from "../core/appSettings";

const APP_SETTINGS_STORAGE_KEY = "benefriches/app-settings/v0";

export class LocalStorageAppSettings implements AppSettingsGateway {
  getAll(): AppSettings {
    const fromLocalStorage = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);

    const appSettings = fromLocalStorage ? (JSON.parse(fromLocalStorage) as AppSettings) : {};
    return { ...DEFAULT_APP_SETTINGS, ...appSettings };
  }

  persist(appSettings: AppSettings) {
    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(appSettings));
  }
}
