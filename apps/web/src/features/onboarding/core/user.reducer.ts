import { createReducer, createSelector, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { createUser } from "./createUser.action";
import { initCurrentUser } from "./initCurrentUser.action";
import { AuthenticatedUser, UserStructure } from "./user";

type State = {
  currentUser: AuthenticatedUser | null;
  currentUserState: "idle" | "loading" | "authenticated" | "unauthenticated";
  createUserState: "idle" | "loading" | "success" | "error";
  createUserError?: string;
};

export const initialState: State = {
  currentUser: null,
  currentUserState: "idle",
  createUserState: "idle",
};

export const currentUserReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    initCurrentUser.fulfilled,
    (state, action: PayloadAction<AuthenticatedUser | undefined>) => {
      state.currentUserState = "authenticated";

      if (action.payload) state.currentUser = action.payload;
    },
  );
  builder.addCase(initCurrentUser.pending, (state) => {
    state.currentUserState = "loading";
  });
  builder.addCase(initCurrentUser.rejected, (state) => {
    state.currentUserState = "unauthenticated";
    state.currentUser = null;
  });

  builder.addCase(createUser.pending, (state) => {
    state.createUserState = "loading";
  });
  builder.addCase(createUser.fulfilled, (state) => {
    state.createUserState = "success";
  });
  builder.addCase(createUser.rejected, (state, action) => {
    state.createUserState = "error";
    state.createUserError = action.error.message;
  });
});

export const selectCurrentUserStructure = createSelector(
  [(state: RootState) => state.currentUser],
  (state): UserStructure | undefined => {
    return state.currentUser
      ? {
          type: state.currentUser.structureType,
          activity: state.currentUser.structureActivity,
          name: state.currentUser.structureName,
        }
      : undefined;
  },
);

export const selectCurrentUserId = createSelector(
  [(state: RootState) => state.currentUser],
  (state) => {
    return state.currentUser?.id;
  },
);

export const selectCurrentUserFirstname = createSelector(
  [(state: RootState) => state.currentUser],
  (state) => {
    return state.currentUser?.firstname;
  },
);

export const selectCurrentUserEmail = createSelector(
  [(state: RootState) => state.currentUser],
  (state) => {
    return state.currentUser?.email;
  },
);
