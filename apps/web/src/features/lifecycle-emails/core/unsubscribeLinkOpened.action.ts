import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

export const unsubscribeLinkOpened = createAppAsyncThunk<void, { token: string }>(
  "lifecycleEmails/unsubscribeLinkOpened",
  async ({ token }, { extra }) => {
    await extra.lifecycleEmailsService.unsubscribe(token);
  },
);
