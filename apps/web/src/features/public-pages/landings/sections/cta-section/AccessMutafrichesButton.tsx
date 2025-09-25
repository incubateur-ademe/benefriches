import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/shared/views/router";

export default function AccessMutafrichesButton(buttonProps: Partial<ButtonProps.Common>) {
  return (
    <Button linkProps={routes.fricheMutability().link} {...buttonProps}>
      Analyser la compatibilité de ma friche
    </Button>
  );
}
