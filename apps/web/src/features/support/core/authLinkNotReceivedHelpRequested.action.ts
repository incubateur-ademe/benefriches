import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

export const authLinkNotReceivedHelpRequested = createAppAsyncThunk<void, { email: string }>(
  "support/authLinkNotReceivedHelpRequested",
  ({ email }, { extra }) => {
    extra.supportChatService.setUserEmail(email);
    const message = `Bonjour, je n'ai pas reçu mon lien de connexion. Mon adresse e-mail : ${email}`;
    extra.supportChatService.openWithMessage(message);
  },
);
