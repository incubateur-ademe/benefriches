import { createSelector, createSlice } from "@reduxjs/toolkit";
import { User } from "../domain/user";
import { initCurrentUserAction } from "./initCurrentUser.action";

import { RootState } from "@/app/application/store";

export type State = {
  currentUser: User | null;
};

const initialState: State = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(initCurrentUserAction.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
  },
});

export const selectCurrentUserCompany = createSelector(
  [(state: RootState) => state.currentUser],
  (state): string => {
    return (
      state.currentUser?.organization?.name ?? "Votre entreprise (raison sociale non renseignée)"
    );
  },
);

export const selectCurrentUserId = createSelector(
  [(state: RootState) => state.currentUser],
  (state) => {
    return state.currentUser?.id;
  },
);

export default userSlice.reducer;
