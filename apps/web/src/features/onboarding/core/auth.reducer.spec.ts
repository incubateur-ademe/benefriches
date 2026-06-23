import { describe, expect, it } from "vitest";

import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { AuthenticationGateway } from "./AuthenticationGateway";
import { authenticateWithToken } from "./authenticateWithToken.action";

class FailingAuthService implements AuthenticationGateway {
  constructor(private readonly errorCode: string) {}

  async authenticateWithToken(): Promise<void> {
    throw new Error(this.errorCode);
  }

  async requestLink(): Promise<void> {
    return Promise.resolve();
  }
}

describe("auth reducer", () => {
  describe("authenticateWithToken action", () => {
    it("sets success state when authentication succeeds", async () => {
      const store = createStore(getTestAppDependencies());

      await store.dispatch(authenticateWithToken({ token: "valid-token" }));

      expect(store.getState().auth.authenticationWithTokenState).toBe("success");
      expect(store.getState().auth.authenticationWithTokenError).toBeUndefined();
    });

    it("stores TOKEN_EXPIRED error code when token is expired", async () => {
      const store = createStore(
        getTestAppDependencies({
          authService: new FailingAuthService("TOKEN_EXPIRED"),
        }),
      );

      await store.dispatch(authenticateWithToken({ token: "expired-token" }));

      expect(store.getState().auth.authenticationWithTokenState).toBe("error");
      expect(store.getState().auth.authenticationWithTokenError).toBe("TOKEN_EXPIRED");
    });

    it("stores TOKEN_ALREADY_USED error code when token was already used", async () => {
      const store = createStore(
        getTestAppDependencies({
          authService: new FailingAuthService("TOKEN_ALREADY_USED"),
        }),
      );

      await store.dispatch(authenticateWithToken({ token: "used-token" }));

      expect(store.getState().auth.authenticationWithTokenState).toBe("error");
      expect(store.getState().auth.authenticationWithTokenError).toBe("TOKEN_ALREADY_USED");
    });

    it("stores TOKEN_NOT_FOUND error code when token is invalid", async () => {
      const store = createStore(
        getTestAppDependencies({
          authService: new FailingAuthService("TOKEN_NOT_FOUND"),
        }),
      );

      await store.dispatch(authenticateWithToken({ token: "invalid-token" }));

      expect(store.getState().auth.authenticationWithTokenState).toBe("error");
      expect(store.getState().auth.authenticationWithTokenError).toBe("TOKEN_NOT_FOUND");
    });
  });
});
