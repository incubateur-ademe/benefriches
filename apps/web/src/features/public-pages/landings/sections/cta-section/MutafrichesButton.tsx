import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";

import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import { featureAlertSubscribed } from "@/features/user-feature-alerts/core/createFeatureAlert.action";
import { selectUserFeaturesAlerts } from "@/features/user-feature-alerts/core/userFeatureAlert.reducer";
import { mutafrichesHomepageModalOpened, trackEvent } from "@/shared/views/analytics";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import MutafrichesAvailabilityModal from "./MutafrichesAvailabilityModal";
import { mutafrichesAvailabilityModal } from "./mutafrichesModal";

export default function MutafrichesButton(buttonProps: Partial<ButtonProps.Common>) {
  const dispatch = useAppDispatch();
  const userEmail = useAppSelector(selectCurrentUserEmail);
  const { createUserFeatureAlertState } = useAppSelector(selectUserFeaturesAlerts);
  const mutafrichesAvailabilityAlertSubscribed = (email: string) => {
    void dispatch(
      featureAlertSubscribed({
        feature: { type: "mutafriches_availability" },
        email,
      }),
    );
  };

  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => {
          trackEvent(mutafrichesHomepageModalOpened());
          mutafrichesAvailabilityModal.open();
        }}
      >
        Analyser la compatibilité de ma friche
      </Button>
      <MutafrichesAvailabilityModal
        onSubmit={mutafrichesAvailabilityAlertSubscribed}
        onSaveLoadingState={createUserFeatureAlertState.mutafrichesAvailability}
        userEmail={userEmail}
      />
    </>
  );
}
