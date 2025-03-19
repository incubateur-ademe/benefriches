import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { stepRevertCancelled, stepRevertConfirmed } from "../core/actions/revert.actions";
import { selectShouldConfirmStepRevert } from "../core/selectors/createSite.selectors";

const modal = createModal({
  id: "form-step-revert-confirmation",
  isOpenedByDefault: false,
});

export default function StepRevertConfirmationModal() {
  const showWarning = useAppSelector(selectShouldConfirmStepRevert);
  const dispatch = useAppDispatch();
  useIsModalOpen(modal, {
    onConceal: () => {
      dispatch(stepRevertCancelled());
    },
  });

  useEffect(() => {
    if (showWarning) {
      modal.open();
    } else {
      modal.close();
    }
  }, [showWarning]);

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
            dispatch(stepRevertConfirmed());
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
    </modal.Component>
  );
}
