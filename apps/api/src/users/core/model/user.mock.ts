import { UserProps } from "../usecases/createUser.usecase";
import { User } from "./user";

export const buildMinimalUserProps = (): UserProps => {
  return {
    id: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
    email: "user@collectivite.fr",
    structureActivity: "urban_planner",
    structureType: "company",
    personalDataAnalyticsUseConsented: false,
    personalDataCommunicationUseConsented: false,
    personalDataStorageConsented: true,
    createdFrom: "features_app",
  };
};

export const buildExhaustiveUserProps = (): Required<UserProps> => {
  return {
    id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
    email: "user@collectivite.fr",
    firstname: "Jane",
    lastname: "Doe",
    structureType: "municipality",
    structureActivity: "local_authority",
    structureName: "Mairie de Blajan",
    personalDataAnalyticsUseConsented: false,
    personalDataCommunicationUseConsented: true,
    personalDataStorageConsented: true,
    createdFrom: "demo_app",
  };
};

export const buildUser = (props?: Partial<User>): User => {
  return {
    ...buildMinimalUserProps(),
    createdAt: new Date(),
    personalDataStorageConsentedAt: new Date(),
    ...props,
  };
};
