import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import { createFeatureAlert } from "@/features/user-feature-alerts/core/createFeatureAlert.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import TileExportImpacts from "./TileExportImpacts";

const TileExportImpactsContainer = () => {
  const { exportImpactsAlert, createUserFeatureAlertState } = useAppSelector(
    (state) => state.userFeatureAlert,
  );

  const dispatch = useAppDispatch();
  const userEmail = useAppSelector(selectCurrentUserEmail);

  return (
    <TileExportImpacts
      onSubmit={({ email, options }) => {
        void dispatch(createFeatureAlert({ email, feature: { type: "export_impacts", options } }));
      }}
      exportImpactsAlert={exportImpactsAlert ?? false}
      onSaveLoadingState={createUserFeatureAlertState.exportImpacts}
      userEmail={userEmail}
    />
  );
};

export default TileExportImpactsContainer;
