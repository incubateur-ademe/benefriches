import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";

import { BENEFRICHES_ENV } from "@/shared/views/envVars";
import { routes } from "@/shared/views/router";

export default function BenefrichesButton(buttonProps: Partial<ButtonProps.Common>) {
  return (
    <Button
      linkProps={{
        ...(BENEFRICHES_ENV.authEnabled
          ? routes.accessBenefriches().link
          : routes.onBoardingIdentity().link),
      }}
      {...buttonProps}
    >
      Évaluer les impacts de mon projet
    </Button>
  );
}
