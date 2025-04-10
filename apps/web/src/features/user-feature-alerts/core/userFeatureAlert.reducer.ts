import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createFeatureAlert } from "./createFeatureAlert.action";
import { loadFeatureAlerts } from "./loadFeatureAlerts.action";
import {
  CompareImpactsFeatureAlert,
  ExportImpactsFeatureAlert,
  UserFeatureAlert,
} from "./userFeatureAlert";

type Status = "idle" | "loading" | "success" | "error";
type State = {
  compareImpactsAlert?: {
    hasAlert: boolean;
    options?: CompareImpactsFeatureAlert["options"];
  };
  duplicateProjectAlert?: {
    hasAlert: boolean;
  };
  exportImpactsAlert?: {
    hasAlert: boolean;
    options?: ExportImpactsFeatureAlert["options"];
  };
  createUserFeatureAlertState: {
    compareImpacts: Status;
    duplicateProject: Status;
    exportImpacts: Status;
  };
};

const initialState: State = {
  createUserFeatureAlertState: {
    compareImpacts: "idle",
    duplicateProject: "idle",
    exportImpacts: "idle",
  },
};

const userFeatureAlertSlice = createSlice({
  name: "userFeatureAlerts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(createFeatureAlert.pending, (state, action) => {
      const type = action.meta.arg.feature.type;
      switch (type) {
        case "compare_impacts":
          state.createUserFeatureAlertState.compareImpacts = "loading";
          break;
        case "duplicate_project":
          state.createUserFeatureAlertState.duplicateProject = "loading";
          break;
        case "export_impacts":
          state.createUserFeatureAlertState.exportImpacts = "loading";
          break;
      }
    });
    builder.addCase(
      createFeatureAlert.fulfilled,
      (state, action: PayloadAction<UserFeatureAlert>) => {
        const { feature } = action.payload;
        switch (feature.type) {
          case "compare_impacts":
            state.compareImpactsAlert = {
              hasAlert: true,
              options: feature.options,
            };
            state.createUserFeatureAlertState.compareImpacts = "success";
            break;
          case "duplicate_project":
            state.duplicateProjectAlert = { hasAlert: true };
            state.createUserFeatureAlertState.duplicateProject = "success";
            break;
          case "export_impacts":
            state.exportImpactsAlert = { hasAlert: true, options: feature.options };
            state.createUserFeatureAlertState.exportImpacts = "success";
            break;
        }
      },
    );
    builder.addCase(createFeatureAlert.rejected, (state, action) => {
      const type = action.meta.arg.feature.type;
      switch (type) {
        case "compare_impacts":
          state.createUserFeatureAlertState.compareImpacts = "error";
          break;
        case "duplicate_project":
          state.createUserFeatureAlertState.duplicateProject = "error";
          break;
        case "export_impacts":
          state.createUserFeatureAlertState.exportImpacts = "error";
          break;
      }
    });

    builder.addCase(
      loadFeatureAlerts.fulfilled,
      (state, action: PayloadAction<Omit<State, "createUserFeatureAlertState">>) => {
        state.exportImpactsAlert = action.payload.exportImpactsAlert;
        state.duplicateProjectAlert = action.payload.duplicateProjectAlert;
        state.compareImpactsAlert = action.payload.compareImpactsAlert;
      },
    );
  },
});

export default userFeatureAlertSlice.reducer;
