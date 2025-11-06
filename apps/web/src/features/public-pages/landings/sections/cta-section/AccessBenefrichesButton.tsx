import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/shared/views/router";

export default function BenefrichesButton(buttonProps: Partial<ButtonProps.Common>) {
  return (
    <Button
      linkProps={routes.onBoardingWhenToUse({ fonctionnalite: "evaluation-impacts" }).link}
      {...buttonProps}
    >
      Évaluer les impacts de mon projet
    </Button>
  );
}
