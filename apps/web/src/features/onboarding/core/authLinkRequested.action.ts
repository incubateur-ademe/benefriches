import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

export const authLinkRequested = createAppAsyncThunk<
  undefined,
  { email: string; postLoginRedirectTo: string | undefined }
>("auth/authLinkRequested", async ({ email, postLoginRedirectTo }, { extra }) => {
  await extra.authService.requestLink(email, postLoginRedirectTo);

  return undefined;
});
