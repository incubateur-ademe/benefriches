import Button from "@codegouvfr/react-dsfr/Button";

import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";

import { useAppSelector } from "../../hooks/store.hooks";

export default function HelpButton() {
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);
  const state = useAppSelector((state) => state);

  return (
    currentUserEmail && (
      <Button
        className="tw-fixed tw-bottom-6 tw-right-6 tw-z-10"
        data-tally-open="mOVXLY"
        data-tally-width="400"
        data-tally-emoji-text="👋"
        data-tally-emoji-animation="wave"
        data-tally-auto-close="0"
        data-email={currentUserEmail}
        data-url={window.location.href}
        data-client-state={btoa(JSON.stringify(state))} // base-64 encode the client state
        size="medium"
        priority="secondary"
      >
        Besoin d'aide ?
      </Button>
    )
  );
}
