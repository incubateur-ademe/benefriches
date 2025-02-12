import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import { createFeatureAlert } from "@/features/user-feature-alerts/core/createFeatureAlert.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import TileCompareImpacts from "./TileCompareImpacts";

const TileCompareImpactsContainer = () => {
  const { compareImpactsAlert, createUserFeatureAlertState } = useAppSelector(
    (state) => state.userFeatureAlert,
  );
  const userEmail = useAppSelector(selectCurrentUserEmail);

  const dispatch = useAppDispatch();

  return (
    <TileCompareImpacts
      onSubmit={({ email, options }) => {
        console.log("ccc");
        void dispatch(createFeatureAlert({ email, feature: { type: "compare_impacts", options } }));
      }}
      compareImpactsAlert={compareImpactsAlert ?? false}
      onSaveLoadingState={createUserFeatureAlertState.compareImpacts}
      userEmail={userEmail}
    />
  );
};

export default TileCompareImpactsContainer;
