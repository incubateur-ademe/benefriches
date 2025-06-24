import Button from "@codegouvfr/react-dsfr/Button";

import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";

import { useAppSelector } from "../../hooks/store.hooks";

type Props = {
  small?: boolean;
};

export default function HelpButton({ small }: Props) {
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);

  return (
    currentUserEmail && (
      <Button
        data-tally-open="mOVXLY"
        data-tally-width="400"
        data-tally-emoji-text="👋"
        data-tally-emoji-animation="wave"
        data-tally-auto-close="0"
        data-email={currentUserEmail}
        data-url={window.location.href}
        size="medium"
        priority="secondary"
        aria-label="Besoin d'aide ?"
      >
        {small ? "?" : "Besoin d'aide ?"}
      </Button>
    )
  );
}
