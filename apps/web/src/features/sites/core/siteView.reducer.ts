import { createReducer, createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { fetchSiteView } from "./fetchSiteView.action";
import { SiteView } from "./site.types";

type SiteViewState = {
  byId: Record<
    string,
    | { loadingState: "idle" | "loading" | "error"; data: SiteView | undefined }
    | { loadingState: "success"; data: SiteView }
  >;
};

const getInitialState = (): SiteViewState => {
  return {
    byId: {},
  };
};

export const siteViewReducer = createReducer(getInitialState(), (builder) => {
  builder
    .addCase(fetchSiteView.pending, (state, action) => {
      const siteId = action.meta.arg.siteId;
      if (!state.byId[siteId]) {
        state.byId[siteId] = {
          data: undefined,
          loadingState: "loading",
        };
      } else {
        state.byId[siteId].loadingState = "loading";
      }
    })
    .addCase(fetchSiteView.fulfilled, (state, action) => {
      const siteId = action.meta.arg.siteId;
      state.byId[siteId] = {
        data: action.payload,
        loadingState: "success",
      };
    })
    .addCase(fetchSiteView.rejected, (state, action) => {
      const siteId = action.meta.arg.siteId;
      if (state.byId[siteId]) {
        state.byId[siteId].loadingState = "error";
      } else {
        state.byId[siteId] = {
          data: undefined,
          loadingState: "error",
        };
      }
    });
});

const selectSelf = (state: RootState) => state.siteView;

export type SitePageViewModel =
  | { loadingState: "idle" | "loading" | "error"; siteView: undefined }
  | { loadingState: "success"; siteView: SiteView };

export const selectSitePageViewModel = createSelector(
  [selectSelf, (_state: RootState, siteId: string) => siteId],
  (state, siteId): SitePageViewModel => {
    const siteData = state.byId[siteId];

    if (!siteData) {
      return {
        loadingState: "idle",
        siteView: undefined,
      };
    }

    return siteData.loadingState === "success"
      ? { loadingState: siteData.loadingState, siteView: siteData.data }
      : { loadingState: siteData.loadingState, siteView: undefined };
  },
);
