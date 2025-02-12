import { UserFeatureAlert } from "./userFeatureAlert";

export interface CreateFeatureAlertGateway {
  save(props: UserFeatureAlert): Promise<void>;
  persistNewFeatureAlert(props: UserFeatureAlert["feature"]["type"]): void;
  getList(): UserFeatureAlert["feature"]["type"][];
}
