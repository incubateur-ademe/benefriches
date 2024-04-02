import { User } from "./user";

export const buildUser = (props?: Partial<User>): User => {
  return {
    id: "301d0f47-3775-4320-8e06-381047bebbed",
    email: "john.doe@mail.com",
    firstname: "John",
    lastname: "Doe",
    personalDataAnalyticsUseConsented: true,
    personalDataCommunicationUseConsented: true,
    personalDataStorageConsented: true,
    structureActivity: "photovoltaic_plants_developer",
    structureType: "company",
    ...props,
  };
};
