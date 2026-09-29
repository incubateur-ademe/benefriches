import { createReducer } from "@reduxjs/toolkit";

import { unsubscribeLinkOpened } from "./unsubscribeLinkOpened.action";

export type LifecycleEmailsUnsubscribeState = {
  status: "idle" | "loading" | "success" | "error";
  errorCode?: string;
};

const initialState: LifecycleEmailsUnsubscribeState = {
  status: "idle",
  errorCode: undefined,
};

export const lifecycleEmailsUnsubscribeReducer = createReducer(initialState, (builder) => {
  builder.addCase(unsubscribeLinkOpened.pending, (state) => {
    state.status = "loading";
    state.errorCode = undefined;
  });
  builder.addCase(unsubscribeLinkOpened.fulfilled, (state) => {
    state.status = "success";
  });
  builder.addCase(unsubscribeLinkOpened.rejected, (state, action) => {
    state.status = "error";
    state.errorCode = action.error.message;
  });
});
