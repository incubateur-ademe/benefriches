import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/app/application/store";

import { createUser } from "./createUser.action";
import { initCurrentUser } from "./initCurrentUser.action";
import { User, UserStructure } from "./user";

type State = {
  currentUser: User | null;
  currentUserLoaded: boolean;
  createUserState: "idle" | "loading" | "success" | "error";
};

const initialState: State = {
  currentUser: null,
  currentUserLoaded: false,
  createUserState: "idle",
};

const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(initCurrentUser.fulfilled, (state, action: PayloadAction<User | undefined>) => {
      state.currentUserLoaded = true;

      if (action.payload) state.currentUser = action.payload;
    });
    builder.addCase(createUser.pending, (state) => {
      state.createUserState = "loading";
    });
    builder.addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.createUserState = "success";
    });
    builder.addCase(createUser.rejected, (state) => {
      state.createUserState = "error";
    });
  },
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

export const isCurrentUserLoaded = createSelector(
  [(state: RootState) => state.currentUser],
  (state) => {
    return state.currentUserLoaded;
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

export default userSlice.reducer;
