import { describe, expect, it } from "vitest";

import { createStore } from "@/app/store/store";
import { InMemorySupportChatService } from "@/features/support/infrastructure/support-chat-service/InMemorySupportChatService";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { onboardingWelcomeHelpRequested } from "../onboardingWelcomeHelpRequested.action";

describe("onboardingWelcomeHelpRequested", () => {
  it("should open support chat with a greeting message", async () => {
    const supportChatService = new InMemorySupportChatService();
    const store = createStore(getTestAppDependencies({ supportChatService }));

    await store.dispatch(onboardingWelcomeHelpRequested());

    expect(supportChatService._messages).toEqual([
      "Bonjour Mintsa, j'ai une question sur mes premiers pas sur Bénéfriches.",
    ]);
  });
});
