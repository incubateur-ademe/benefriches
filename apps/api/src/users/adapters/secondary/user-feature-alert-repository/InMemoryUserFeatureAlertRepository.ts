import {
  UserFeatureAlert,
  UserFeatureAlertRepository,
} from "src/users/core/usecases/createUserFeatureAlert.usecase";

export class InMemoryUserFeatureAlertsRepository implements UserFeatureAlertRepository {
  private featureAlerts: UserFeatureAlert[] = [];

  async save(featureAlert: UserFeatureAlert) {
    this.featureAlerts.push(featureAlert);
    await Promise.resolve();
  }

  _getUsersFeatureAlerts() {
    return this.featureAlerts;
  }

  _setUsersFeatureAlerts(featureAlerts: UserFeatureAlert[]) {
    this.featureAlerts = featureAlerts;
  }
}
