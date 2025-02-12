import { CreateFeatureAlertGateway } from "../../core/CreateFeatureAlertGateway";
import { UserFeatureAlert } from "../../core/userFeatureAlert";

export class InMemoryCreateFeatureAlertService implements CreateFeatureAlertGateway {
  _featureAlerts: UserFeatureAlert[] = [];

  constructor(private readonly shouldFail: boolean = false) {}

  async save(newAlert: UserFeatureAlert) {
    if (this.shouldFail) throw new Error("Intended error");

    await Promise.resolve(this._featureAlerts.push(newAlert));
  }

  persistNewFeatureAlert() {}

  getList() {
    return this._featureAlerts.map(({ feature }) => feature.type);
  }
}
