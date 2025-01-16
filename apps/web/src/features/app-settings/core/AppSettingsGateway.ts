import { AppSettings } from "./appSettings";

export interface AppSettingsGateway {
  getAll(): AppSettings;

  persist(appSettings: AppSettings): void;
}
