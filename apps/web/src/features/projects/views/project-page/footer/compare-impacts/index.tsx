import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import { createFeatureAlert } from "@/features/user-feature-alerts/core/createFeatureAlert.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ImpactComparisonSection from "./ImpactComparisonSection";

const ImpactComparisonSectionContainer = () => {
  const { compareImpactsAlert, createUserFeatureAlertState } = useAppSelector(
    (state) => state.userFeatureAlert,
  );

  const siteIsFriche = useAppSelector(
    (state) => state.projectImpacts.relatedSiteData?.nature === "FRICHE",
  );

  const userEmail = useAppSelector(selectCurrentUserEmail);

  const dispatch = useAppDispatch();

  if (!siteIsFriche) {
    return null;
  }

  return (
    <ImpactComparisonSection
      onSubmit={({ email, options }) => {
        void dispatch(createFeatureAlert({ email, feature: { type: "compare_impacts", options } }));
      }}
      userCompareImpactsAlerts={compareImpactsAlert?.options}
      onSaveLoadingState={createUserFeatureAlertState.compareImpacts}
      userEmail={userEmail}
    />
  );
};

export default ImpactComparisonSectionContainer;
