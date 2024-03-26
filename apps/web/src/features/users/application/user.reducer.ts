import { createSelector, createSlice } from "@reduxjs/toolkit";
import { User } from "../domain/user";
import { createIdentity } from "./createIdentity.action";
import { initCurrentUserAction } from "./initCurrentUser.action";

import { RootState } from "@/app/application/store";

export type State = {
  currentUser: User | null;
  saveIdentityState: "idle" | "loading" | "success" | "error";
};

const initialState: State = {
  currentUser: null,
  saveIdentityState: "idle",
};

export const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(initCurrentUserAction.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(createIdentity.pending, (state) => {
      state.saveIdentityState = "loading";
    });
    builder.addCase(createIdentity.fulfilled, (state) => {
      state.saveIdentityState = "success";
    });
    builder.addCase(createIdentity.rejected, (state) => {
      state.saveIdentityState = "error";
    });
  },
});

export const selectCurrentUserCompany = createSelector(
  [(state: RootState) => state.currentUser],
  (state): Exclude<User["organization"], undefined> => {
    return (
      state.currentUser?.organization ?? {
        id: "",
        type: "company",
        name: "Raison sociale non renseignée",
      }
    );
  },
);

export const selectCurrentUserId = createSelector(
  [(state: RootState) => state.currentUser],
  (state) => {
    return state.currentUser?.id;
  },
);

export const selectIsCurrentUserIdentitySaved = createSelector(
  [(state: RootState) => state.currentUser],
  (state) => {
    return state.currentUser?.identitySaved;
  },
);

export default userSlice.reducer;
