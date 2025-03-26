import {
  CreateFeatureAlertGateway,
  UserFeatureAlertsResult,
} from "../../core/CreateFeatureAlertGateway";
import { UserFeatureAlert } from "../../core/userFeatureAlert";
import { getNewFeatureAlerts } from "./CreateFeatureAlertService";

export class InMemoryCreateFeatureAlertService implements CreateFeatureAlertGateway {
  _featureAlerts: UserFeatureAlertsResult = {};

  constructor(private readonly shouldFail: boolean = false) {}

  async save(newAlert: UserFeatureAlert) {
    if (this.shouldFail) throw new Error("Intended error");

    await Promise.resolve(getNewFeatureAlerts(newAlert.feature, this._featureAlerts));
  }

  persistNewFeatureAlert() {}

  getPersistedFeatureAlerts() {
    return this._featureAlerts;
  }
}
