import { createReducer } from "@reduxjs/toolkit";

import { authLinkRequestReset } from "./authLinkRequestReset.action";
import { authLinkRequested } from "./authLinkRequested.action";
import { authenticateWithToken } from "./authenticateWithToken.action";

type State = {
  authLinkRequestState: "idle" | "loading" | "success" | "error";
  authLinkRequestError?: string;
  authenticationWithTokenState: "idle" | "loading" | "success" | "error";
};

export const initialState: State = {
  authLinkRequestState: "idle",
  authLinkRequestError: undefined,
  authenticationWithTokenState: "idle",
};

export const authReducer = createReducer(initialState, (builder) => {
  builder.addCase(authLinkRequested.pending, (state) => {
    state.authLinkRequestState = "loading";
    state.authLinkRequestError = undefined;
  });
  builder.addCase(authLinkRequested.fulfilled, (state) => {
    state.authLinkRequestState = "success";
  });
  builder.addCase(authLinkRequested.rejected, (state, action) => {
    state.authLinkRequestState = "error";
    state.authLinkRequestError = action.error.message;
  });
  builder.addCase(authLinkRequestReset, (state) => {
    state.authLinkRequestState = "idle";
    state.authLinkRequestError = undefined;
  });
  builder.addCase(authenticateWithToken.fulfilled, (state) => {
    state.authenticationWithTokenState = "success";
  });
  builder.addCase(authenticateWithToken.pending, (state) => {
    state.authenticationWithTokenState = "loading";
  });
  builder.addCase(authenticateWithToken.rejected, (state) => {
    state.authenticationWithTokenState = "error";
  });
});
