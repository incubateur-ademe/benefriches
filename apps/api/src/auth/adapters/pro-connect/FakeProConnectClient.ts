import { FetchUserIdentityResult, ProConnectClient } from "./ProConnectClient";

export class FakeProConnectClient implements ProConnectClient {
  shouldThrowError = false;

  public mockUserIdentity: FetchUserIdentityResult = {
    idToken: "fake-id-token",
    email: "test@example.fr",
    id: "aa20f6c2-9436-4bdc-a392-f20fb4cb2084",
    firstName: "John",
    lastName: "Doe",
    siret: "12345678901234",
  };

  public mockAuthUrl = new URL("https://fake-pro-connect.com/auth");
  public mockLogoutUrl = new URL("https://fake-pro-connect.com/logout");

  async getAuthorizationUrl(): Promise<{ authorizationUrl: URL; state: string; nonce: string }> {
    return Promise.resolve({
      authorizationUrl: this.mockAuthUrl,
      state: "fake-state",
      nonce: "fake-nonce",
    });
  }

  async getLogoutUrl(): Promise<URL> {
    return Promise.resolve(this.mockLogoutUrl);
  }

  async fetchUserIdentity(): Promise<FetchUserIdentityResult> {
    return Promise.resolve(this.mockUserIdentity);
  }

  // Helper methods for tests to configure behavior
  _setMockUserIdentity(identity: Partial<FetchUserIdentityResult>) {
    this.mockUserIdentity = { ...this.mockUserIdentity, ...identity };
  }

  _setErrorBehavior(shouldThrow: boolean) {
    this.shouldThrowError = shouldThrow;
    if (shouldThrow) {
      this.fetchUserIdentity = () => {
        throw new Error("ProConnect authentication failed");
      };
    }
  }
}
