import { AuthenticationGateway } from "../../core/AuthenticationGateway";

export default class FakeAuthService implements AuthenticationGateway {
  _emailRequested: string | null = null;
  _tokenAuthenticated: string | null = null;

  async authenticateWithToken(token: string): Promise<void> {
    this._tokenAuthenticated = token;
    return Promise.resolve();
  }

  async requestLink(email: string): Promise<void> {
    this._emailRequested = email;
    return Promise.resolve();
  }
}
