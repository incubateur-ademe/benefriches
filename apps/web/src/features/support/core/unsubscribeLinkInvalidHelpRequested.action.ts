import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

export const unsubscribeLinkInvalidHelpRequested = createAppAsyncThunk<void>(
  "support/unsubscribeLinkInvalidHelpRequested",
  (_, { extra }) => {
    const message =
      "Bonjour, mon lien de désinscription des e-mails Bénéfriches ne fonctionne pas.";
    extra.supportChatService.openWithMessage(message);
  },
);
