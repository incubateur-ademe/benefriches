import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

export const authLinkRequested = createAppAsyncThunk<undefined, { email: string }>(
  "auth/authLinkRequested",
  async ({ email }, { extra }) => {
    await extra.authService.requestLink(email);

    return undefined;
  },
);
