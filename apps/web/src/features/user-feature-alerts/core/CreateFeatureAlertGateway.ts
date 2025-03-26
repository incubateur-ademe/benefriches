import {
  CompareImpactsFeatureAlert,
  ExportImpactsFeatureAlert,
  UserFeatureAlert,
} from "./userFeatureAlert";

export type UserFeatureAlertsResult = {
  compareImpactsAlert?: {
    hasAlert: boolean;
    options?: CompareImpactsFeatureAlert["options"];
  };
  duplicateProjectAlert?: {
    hasAlert: boolean;
  };
  exportImpactsAlert?: {
    hasAlert: boolean;
    options?: ExportImpactsFeatureAlert["options"];
  };
};

export interface CreateFeatureAlertGateway {
  save(props: UserFeatureAlert): Promise<void>;
  persistNewFeatureAlert(props: UserFeatureAlert["feature"]): void;
  getPersistedFeatureAlerts(): UserFeatureAlertsResult;
}
