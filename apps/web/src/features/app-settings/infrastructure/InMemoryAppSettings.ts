import type { AppSettingsGateway } from "../core/AppSettingsGateway";
import type { AppSettings } from "../core/appSettings";
import { DEFAULT_APP_SETTINGS } from "../core/appSettings";

export class InMemoryAppSettings implements AppSettingsGateway {
  private appSettings: AppSettings = DEFAULT_APP_SETTINGS;

  getAll(): AppSettings {
    return this.appSettings;
  }

  persist(appSettings: AppSettings) {
    this.appSettings = appSettings;
  }
}
