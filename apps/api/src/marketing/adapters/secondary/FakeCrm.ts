import { CRMGateway, NewContactProps } from "src/marketing/core/CRMGateway";

export type LoginUpdate = {
  email: string;
  loginDate: Date;
};

export class FakeCrm implements CRMGateway {
  readonly _newContacts: NewContactProps[] = [];
  readonly _loginUpdates: LoginUpdate[] = [];

  createContact(props: NewContactProps): Promise<void> {
    this._newContacts.push(props);
    return Promise.resolve();
  }

  updateContactLastLoginDate(email: string, loginDate: Date): Promise<void> {
    this._loginUpdates.push({ email, loginDate });
    return Promise.resolve();
  }
}
