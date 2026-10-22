import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

export const selectCurrentUserIsAdmin = createSelector(
  [(state: RootState) => state.currentUser],
  (state): boolean => {
    return state.currentUser?.isAdmin ?? false;
  },
);
