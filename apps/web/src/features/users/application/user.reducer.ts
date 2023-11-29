import { createSelector, createSlice } from "@reduxjs/toolkit";
import { User } from "../domain/user";

import { RootState } from "@/store";

export type State = {
  currentUser: User | null;
};

const initialState: State = {
  currentUser: {
    id: "57baec3c-3a67-4e7d-b46b-8eb9f1d40e2e",
    email: "test-user@mail.com",
    firstName: "Test",
    lastName: "User",
    organization: {
      id: "e6d44e75-96ca-418b-852e-eb4a6a71fbce",
      name: "Générale du Solaire",
      type: "company",
    },
  },
};

export const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {},
});

export const selectCurrentUserCompany = createSelector(
  [(state: RootState) => state.currentUser],
  (state): string => {
    return state.currentUser?.organization.name ?? "Entreprise inconnue";
  },
);

export default userSlice.reducer;
