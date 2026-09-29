import { createSelector } from "@reduxjs/toolkit";
import { unsubscribeFromLifecycleEmailsErrorCodeSchema } from "shared";

import type { RootState } from "@/app/store/store";

export type LifecycleEmailsUnsubscribeViewData =
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; reason: "invalid-link" | "technical" };

const isInvalidLinkError = (errorCode: string | undefined): boolean =>
  unsubscribeFromLifecycleEmailsErrorCodeSchema.safeParse(errorCode).success;

export const selectLifecycleEmailsUnsubscribeViewData = createSelector(
  (state: RootState) => state.lifecycleEmailsUnsubscribe,
  (unsubscribeState): LifecycleEmailsUnsubscribeViewData => {
    switch (unsubscribeState.status) {
      case "idle":
      case "loading":
        return { status: "loading" };
      case "success":
        return { status: "success" };
      case "error":
        return {
          status: "error",
          reason: isInvalidLinkError(unsubscribeState.errorCode) ? "invalid-link" : "technical",
        };
    }
  },
);
