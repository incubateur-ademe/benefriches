import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useEffect, useState } from "react";

const modal = createModal({
  id: "form-step-revert-confirmation",
  isOpenedByDefault: false,
});

type CallbackPayload = {
  doNotAskAgain: boolean;
};

type Props = {
  open: boolean;
  onCancel: (p: CallbackPayload) => void;
  onConfirm: (p: CallbackPayload) => void;
};

export default function StepRevertConfirmationModal({ open, onCancel, onConfirm }: Props) {
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useIsModalOpen(modal, {
    onConceal: () => {
      onCancel({ doNotAskAgain: doNotShowAgain });
    },
  });

  useEffect(() => {
    // ensure modal is actually in the DOM before opening it
    setTimeout(() => {
      if (open) modal.open();
      else modal.close();
    }, 0);
  }, [open]);

  return (
    <modal.Component
      title="⚠️ Êtes-vous sûr de vouloir revenir en arrière ?"
      concealingBackdrop={false}
      size="large"
      buttons={[
        {
          children: "Valider et accéder à la page précédente",
          doClosesModal: true,
          type: "submit",
          onClick: () => {
            onConfirm({ doNotAskAgain: doNotShowAgain });
          },
        },
        {
          children: "Annuler et rester sur la page en cours",
          doClosesModal: true,
          type: "button",
        },
      ]}
    >
      <p>
        Lorsque vous revenez en arrière dans le formulaire, cela écrase les données que vous aviez
        saisies dans les pages suivantes.
      </p>
      <Checkbox
        options={[
          {
            label: "Ne plus afficher ce message",
            nativeInputProps: {
              defaultChecked: doNotShowAgain,
              value: "doNotShowAgain",
              onChange: (ev) => {
                setDoNotShowAgain(ev.target.checked);
              },
            },
          },
        ]}
      />
    </modal.Component>
  );
}
