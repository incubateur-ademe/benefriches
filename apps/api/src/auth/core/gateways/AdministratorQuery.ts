export const ADMINISTRATOR_QUERY_INJECTION_TOKEN = Symbol("AdministratorQuery");

export interface AdministratorQuery {
  isAdministrator(userId: string): Promise<boolean>;
}
