import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

export const authenticateWithToken = createAppAsyncThunk<undefined, { token: string }>(
  "auth/authenticateWithToken",
  async ({ token }, { extra }) => {
    await extra.authService.authenticateWithToken(token);

    return undefined;
  },
);
