import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

export const authTokenErrorHelpRequested = createAppAsyncThunk<void>(
  "support/authTokenErrorHelpRequested",
  (_, { extra }) => {
    const message =
      "Bonjour, mon lien de connexion ne fonctionne pas. Pouvez-vous m'en envoyer un nouveau ?";
    extra.supportChatService.openWithMessage(message);
  },
);
