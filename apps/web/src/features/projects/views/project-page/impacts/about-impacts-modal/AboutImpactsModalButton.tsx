import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { useId } from "react";

import Dialog from "@/shared/views/components/Dialog/DsfrA11yDialog";

import AboutImpactsContent from "../../../shared/impacts/AboutImpactsContent";

export const ABOUT_IMPACTS_DIALOG_ID = "about-benefriches-impacts-modal";

function AboutImpactsModalButton({
  buttonProps,
}: {
  buttonProps: ButtonProps.Common &
    ((ButtonProps.IconOnly | ButtonProps.WithIcon | ButtonProps.WithoutIcon) &
      ButtonProps.AsButton);
}) {
  const id = useId();

  const dialogId = `${ABOUT_IMPACTS_DIALOG_ID}-${id}`;
  return (
    <>
      <Button
        {...buttonProps}
        nativeButtonProps={{
          ...buttonProps.nativeButtonProps,
          "aria-controls": dialogId,
          "data-fr-opened": false,
        }}
      />
      <Dialog dialogId={dialogId} title="Comprendre les impacts" size="large">
        <h2 className="text-xl">Questions fréquentes</h2>
        <AboutImpactsContent />
      </Dialog>
    </>
  );
}

export default AboutImpactsModalButton;
