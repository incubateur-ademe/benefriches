import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createFeatureAlert } from "./createFeatureAlert.action";
import { loadFeatureAlerts } from "./loadFeatureAlerts.action";
import { UserFeatureAlert } from "./userFeatureAlert";

type Status = "idle" | "loading" | "success" | "error";
type State = {
  compareImpactsAlert?: boolean;
  duplicateProjectAlert?: boolean;
  exportImpactsAlert?: boolean;
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
        const type = action.payload.feature.type;
        switch (type) {
          case "compare_impacts":
            state.compareImpactsAlert = true;
            state.createUserFeatureAlertState.compareImpacts = "success";
            break;
          case "duplicate_project":
            state.duplicateProjectAlert = true;
            state.createUserFeatureAlertState.duplicateProject = "success";
            break;
          case "export_impacts":
            state.exportImpactsAlert = true;
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
      (state, action: PayloadAction<UserFeatureAlert["feature"]["type"][]>) => {
        state.exportImpactsAlert = action.payload.some((type) => type === "export_impacts");
        state.duplicateProjectAlert = action.payload.some((type) => type === "duplicate_project");
        state.compareImpactsAlert = action.payload.some((type) => type === "compare_impacts");
      },
    );
  },
});

export default userFeatureAlertSlice.reducer;
