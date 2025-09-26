import {
  CreateFeatureAlertGateway,
  UserFeatureAlertsResult,
} from "../../core/CreateFeatureAlertGateway";
import { UserFeatureAlert } from "../../core/userFeatureAlert";

const LOCAL_STORAGE_KEY_VO = "benefriches/user-feature-alerts/v0";
const LOCAL_STORAGE_KEY_V1 = "benefriches/user-feature-alerts/v1";

export const getNewFeatureAlerts = (
  featureAlert: UserFeatureAlert["feature"],
  featureAlerts: UserFeatureAlertsResult,
) => {
  switch (featureAlert.type) {
    case "compare_impacts":
      return {
        ...featureAlerts,
        compareImpactsAlert: {
          hasAlert: true,
          options: featureAlert.options,
        },
      };
    case "duplicate_project":
      return { ...featureAlerts, duplicateProjectAlert: { hasAlert: true } };
    case "update_project":
      return { ...featureAlerts, updateProjectAlert: { hasAlert: true } };
    case "update_site":
      return { ...featureAlerts, updateSiteAlert: { hasAlert: true } };
    case "export_impacts":
      return {
        ...featureAlerts,
        exportImpactsAlert: {
          hasAlert: true,
          options: featureAlert.options,
        },
      };
    default:
      return featureAlerts;
  }
};

const loadFromV0ToV1 = (featureAlerts: UserFeatureAlert["feature"]["type"][]) => {
  return {
    compareImpactsAlert: {
      hasAlert: featureAlerts.includes("compare_impacts"),
    },
    duplicateProjectAlert: {
      hasAlert: featureAlerts.includes("duplicate_project"),
    },
    exportImpactsAlert: {
      hasAlert: featureAlerts.includes("export_impacts"),
    },
  };
};

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

  getPersistedFeatureAlerts() {
    const V0fromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY_VO);
    const V1fromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY_V1);

    if (V1fromLocalStorage) {
      try {
        return JSON.parse(V1fromLocalStorage) as UserFeatureAlertsResult;
      } catch (err) {
        console.error("Fail to parse V1fromLocalStorage", err);
        if (V0fromLocalStorage) {
          try {
            return loadFromV0ToV1(
              JSON.parse(V0fromLocalStorage) as UserFeatureAlert["feature"]["type"][],
            );
          } catch (err) {
            console.error("Fail to parse V1fromLocalStorage", err);
          }
        }
      }
    }
    return {};
  }

  persistNewFeatureAlert(featureAlert: UserFeatureAlert["feature"]) {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_V1,
        JSON.stringify(getNewFeatureAlerts(featureAlert, this.getPersistedFeatureAlerts())),
      );
    } catch (err) {
      console.error(
        "Impossible de sauvegarder la configuration 'featureAlerts' dans le localStorage",
        err,
      );
    }
  }
}
