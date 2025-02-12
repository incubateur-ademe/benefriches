import { CreateFeatureAlertGateway } from "../../core/CreateFeatureAlertGateway";
import { UserFeatureAlert } from "../../core/userFeatureAlert";

const LOCAL_STORAGE_KEY = "benefriches/user-feature-alerts/v0";

export class CreateFeatureAlertService implements CreateFeatureAlertGateway {
  async save({ userId, email, feature, id }: UserFeatureAlert) {
    const response = await fetch(`/api/users/feature-alert`, {
      method: "POST",
      body: JSON.stringify({ email, userId, feature, id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while creating feature alert");
  }

  getList() {
    const fromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);

    const featureAlerts = fromLocalStorage
      ? (JSON.parse(fromLocalStorage) as UserFeatureAlert["feature"]["type"][])
      : [];

    return featureAlerts;
  }

  persistNewFeatureAlert(featureAlertType: UserFeatureAlert["feature"]["type"]) {
    try {
      const featureAlerts = this.getList();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...featureAlerts, featureAlertType]));
    } catch (err) {
      console.error(
        "Impossible de sauvegarder la configuration 'featureAlerts' dans le localStorage",
        err,
      );
    }
  }
}
