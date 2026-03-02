import { describe, expect, it } from "vitest";

import { initCurrentUser } from "@/features/onboarding/core/initCurrentUser.action";
import { InMemoryCurrentUserService } from "@/features/onboarding/infrastructure/current-user-service/inMemoryCurrentUserService";
import { InMemorySupportChatService } from "@/features/support/infrastructure/support-chat-service/InMemorySupportChatService";
import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

describe("supportChatListeners", () => {
  it("should set user email in support chat when user is authenticated", async () => {
    const supportChatService = new InMemorySupportChatService();
    const currentUserService = new InMemoryCurrentUserService();
    const store = createStore(getTestAppDependencies({ supportChatService, currentUserService }));

    await store.dispatch(initCurrentUser());

    expect(supportChatService._userEmail).toBe("email@test.fr");
  });

  it("should not set user email in support chat when initCurrentUser returns no user", async () => {
    const supportChatService = new InMemorySupportChatService();
    const currentUserService = {
      get: async () => undefined,
      save: async () => {},
    };
    const store = createStore(getTestAppDependencies({ supportChatService, currentUserService }));

    await store.dispatch(initCurrentUser());

    expect(supportChatService._userEmail).toBeUndefined();
  });

  it("should unset user email in support chat when initCurrentUser fails", async () => {
    const supportChatService = new InMemorySupportChatService();
    supportChatService._userEmail = "previously-set@test.fr";
    const currentUserService = new InMemoryCurrentUserService(true);
    const store = createStore(getTestAppDependencies({ supportChatService, currentUserService }));

    await store.dispatch(initCurrentUser());

    expect(supportChatService._userEmail).toBeUndefined();
  });
});
