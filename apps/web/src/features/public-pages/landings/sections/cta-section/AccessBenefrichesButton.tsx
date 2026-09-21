import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/router";

export default function BenefrichesButton(buttonProps: Partial<ButtonProps.Common>) {
  return (
    <Button
      linkProps={routes.onBoardingWelcome({ fonctionnalite: "evaluation-impacts" }).link}
      {...buttonProps}
    >
      Évaluer les impacts de mon projet
    </Button>
  );
}
