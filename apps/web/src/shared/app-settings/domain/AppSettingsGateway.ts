import { AppSettings } from "./appSettings";

export interface AppSettingsGateway {
  getAll(): AppSettings;
}
