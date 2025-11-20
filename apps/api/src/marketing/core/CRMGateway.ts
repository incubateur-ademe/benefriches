export const CRM_GATEWAY_INJECTION_TOKEN = Symbol("CRMGateway");

export type NewContactProps = {
  email: string;
  firstName: string;
  lastName: string;
  subscribedToNewsletter: boolean;
};

export interface CRMGateway {
  createContact(props: NewContactProps): Promise<void>;
  updateContactLastLoginDate(email: string, loginDate: Date): Promise<void>;
}
