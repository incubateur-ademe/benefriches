import type { DomainEvent } from "src/shared-kernel/domainEvent";

export const ADMINISTRATOR_GRANTED = "administrator.granted";

export type AdministratorGrantedEvent = DomainEvent<
  typeof ADMINISTRATOR_GRANTED,
  {
    userId: string;
    userEmail: string;
  }
>;

export const createAdministratorGrantedEvent = (
  id: string,
  payload: AdministratorGrantedEvent["payload"],
): AdministratorGrantedEvent => {
  return {
    id,
    name: ADMINISTRATOR_GRANTED,
    payload,
  };
};
