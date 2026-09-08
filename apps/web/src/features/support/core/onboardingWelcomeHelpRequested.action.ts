import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

export const onboardingWelcomeHelpRequested = createAppAsyncThunk<void>(
  "support/onboardingWelcomeHelpRequested",
  (_, { extra }) => {
    const message = "Bonjour Mintsa, j'ai une question sur mes premiers pas sur Bénéfriches.";
    extra.supportChatService.openWithMessage(message);
  },
);
