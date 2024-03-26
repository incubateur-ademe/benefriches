import { IdentityProps } from "../usecases/createIdentity.usecase";
import { Identity } from "./identity";

export const buildMinimalIdentityProps = (): IdentityProps => {
  return {
    id: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
    email: "user@collectivite.fr",
    personalDataAnalyticsUseConsented: false,
    personalDataCommunicationUseConsented: false,
    personalDataStorageConsented: true,
  };
};

export const buildExhaustiveIdentityProps = (): Required<IdentityProps> => {
  return {
    id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
    email: "user@collectivite.fr",
    firstname: "Jane",
    lastname: "Doe",
    structureType: "municipality",
    structureName: "Mairie de Blajan",
    personalDataAnalyticsUseConsented: false,
    personalDataCommunicationUseConsented: true,
    personalDataStorageConsented: true,
  };
};

export const buildIdentity = (props?: Partial<Identity>): Identity => {
  return {
    ...buildMinimalIdentityProps(),
    createdAt: new Date(),
    personalDataStorageConsentedAt: new Date(),
    ...props,
  };
};
