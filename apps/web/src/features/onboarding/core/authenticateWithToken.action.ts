import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

export const authenticateWithToken = createAppAsyncThunk<undefined, { token: string }>(
  "auth/authenticateWithToken",
  async ({ token }, { extra }) => {
    await extra.authService.authenticateWithToken(token);

    return undefined;
  },
);
