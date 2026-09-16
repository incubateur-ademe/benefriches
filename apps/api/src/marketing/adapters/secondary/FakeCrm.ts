import { CRMGateway, CrmContact, NewContactProps } from "src/marketing/core/CRMGateway";

export type LoginUpdate = {
  email: string;
  loginDate: Date;
};

export class FakeCrm implements CRMGateway {
  readonly _newContacts: NewContactProps[] = [];
  readonly _loginUpdates: LoginUpdate[] = [];
  readonly _contacts = new Map<string, CrmContact>();
  readonly _emailsToError = new Map<string, Error>();

  createContact(props: NewContactProps): Promise<void> {
    this._newContacts.push(props);
    // Mirror the real CRM: once created, a later lookup finds the contact. Without this the
    // fake cannot model read-after-write and idempotency of repeated runs stays untestable.
    this._contacts.set(props.email, {
      subscribedToNewsletter: props.subscribedToNewsletter,
    });
    return Promise.resolve();
  }

  updateContactLastLoginDate(email: string, loginDate: Date): Promise<void> {
    this._loginUpdates.push({ email, loginDate });
    return Promise.resolve();
  }

  findContactByEmail(email: string): Promise<CrmContact | null> {
    const error = this._emailsToError.get(email);
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(this._contacts.get(email) ?? null);
  }

  _setContact(email: string, subscribedToNewsletter: boolean): void {
    this._contacts.set(email, { subscribedToNewsletter });
  }

  _setEmailError(email: string, error?: Error): void {
    this._emailsToError.set(email, error ?? new Error(`CRM error for ${email}`));
  }
}
