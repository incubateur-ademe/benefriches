import { CRMGateway, NewContactProps } from "src/marketing/core/CRMGateway";

export class FakeCrm implements CRMGateway {
  readonly _newContacts: NewContactProps[] = [];

  createContact(props: NewContactProps): Promise<void> {
    this._newContacts.push(props);
    return Promise.resolve();
  }
}
