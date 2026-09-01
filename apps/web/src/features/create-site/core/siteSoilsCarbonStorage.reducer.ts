import { createSelector, createSlice } from "@reduxjs/toolkit";
import { SoilType } from "shared";

import { RootState } from "@/app/store/store";

import { fetchSiteSoilsCarbonStorage } from "./actions/siteSoilsCarbonStorage.actions";
import { selectSiteAddress } from "./selectors/createSite.selectors";

type LoadingState = "idle" | "loading" | "success" | "error";

export type SiteCarbonStorage = {
  total: number;
  soils: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
  }[];
};

// The fulfilled thunk's payload: the computed carbon storage, tagged with the cityCode it was
// computed for — needed so the slice can tell a stale figure (computed for a since-changed
// address) from a fresh one, without re-deriving the address from elsewhere.
export type SiteCarbonStorageResult = {
  cityCode: string;
  carbonStorage: SiteCarbonStorage;
};

type State = {
  loadingState: LoadingState;
  carbonStorage: SiteCarbonStorage | undefined;
  cityCode: string | undefined;
};

const initialState: State = {
  loadingState: "idle",
  carbonStorage: undefined,
  cityCode: undefined,
};

// Both creation's and the update flow's fetch-soils-carbon-storage thunks feed this single
// global slice — matched by suffix rather than importing the update instance here (see the
// identical note in siteMunicipalityData.reducer.ts).
const isFetchSiteSoilsCarbonStorageAction = (suffix: "pending" | "fulfilled" | "rejected") => {
  return (action: { type: string }): boolean =>
    action.type.endsWith(`/fetchSiteSoilsCarbonStorage/${suffix}`);
};

const siteCarbonStorage = createSlice({
  name: "carbonStorage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isFetchSiteSoilsCarbonStorageAction("pending"), (state) => {
      state.loadingState = "loading";
      state.cityCode = undefined;
    });
    builder.addMatcher(
      isFetchSiteSoilsCarbonStorageAction("fulfilled"),
      (state, action: ReturnType<typeof fetchSiteSoilsCarbonStorage.fulfilled>) => {
        state.loadingState = "success";
        state.carbonStorage = action.payload.carbonStorage;
        state.cityCode = action.payload.cityCode;
      },
    );
    builder.addMatcher(isFetchSiteSoilsCarbonStorageAction("rejected"), (state) => {
      state.loadingState = "error";
      state.cityCode = undefined;
    });
  },
});

export type SiteSoilsCarbonStorageViewData = {
  loadingState: LoadingState;
  carbonStorage: SiteCarbonStorage | undefined;
};

// City-aware: `carbonStorage` is only handed to the view when it was computed for the site's
// CURRENT address's city. After the address changes (see steps/address/address.handlers.ts),
// this returns `undefined` — never the previous city's figures — until the refetch (triggered on
// step entry) completes for the new city.
export const selectSiteSoilsCarbonStorageViewData = createSelector(
  (state: RootState) => state.siteCarbonStorage,
  selectSiteAddress,
  (siteCarbonStorage, siteAddress): SiteSoilsCarbonStorageViewData => ({
    loadingState: siteCarbonStorage.loadingState,
    carbonStorage:
      siteCarbonStorage.cityCode === siteAddress?.cityCode
        ? siteCarbonStorage.carbonStorage
        : undefined,
  }),
);

export default siteCarbonStorage.reducer;
