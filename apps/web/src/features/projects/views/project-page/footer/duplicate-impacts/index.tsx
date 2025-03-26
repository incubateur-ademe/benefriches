import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import { createFeatureAlert } from "@/features/user-feature-alerts/core/createFeatureAlert.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import TileDuplicateProject from "./TileDuplicateProject";

const TileDuplicateProjectContainer = () => {
  const { duplicateProjectAlert, createUserFeatureAlertState } = useAppSelector(
    (state) => state.userFeatureAlert,
  );
  const userEmail = useAppSelector(selectCurrentUserEmail);

  const dispatch = useAppDispatch();

  return (
    <TileDuplicateProject
      onSubmit={({ email }) => {
        void dispatch(createFeatureAlert({ email, feature: { type: "duplicate_project" } }));
      }}
      hasDuplicateProjectAlert={duplicateProjectAlert?.hasAlert ?? false}
      onSaveLoadingState={createUserFeatureAlertState.duplicateProject}
      userEmail={userEmail}
    />
  );
};

export default TileDuplicateProjectContainer;
