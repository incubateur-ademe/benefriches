import type { AuthenticatedUser, User } from "./user";

export const buildUser = (props?: Partial<User & AuthenticatedUser>): User & AuthenticatedUser => {
  return {
    isAdmin: false,
    id: "301d0f47-3775-4320-8e06-381047bebbed",
    email: "john.doe@mail.com",
    firstName: "John",
    lastName: "Doe",
    personalDataAnalyticsUseConsented: true,
    personalDataCommunicationUseConsented: true,
    personalDataStorageConsented: true,
    structureActivity: "photovoltaic_plants_developer",
    structureType: "company",
    subscribedToNewsletter: true,
    ...props,
  };
};
