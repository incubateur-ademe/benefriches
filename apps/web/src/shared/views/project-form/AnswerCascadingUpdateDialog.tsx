import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import { AnswerStepId } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import classNames from "@/shared/views/clsx";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import { STEP_GROUP_LABELS, STEP_TO_GROUP_MAPPING } from "./stepper/stepperConfig";

const DIALOG_DSFR_CSS = [
  "fixed inset-0",
  "w-screen",
  "flex items-center justify-center",
  "z-[1750]",
  "bg-[var(--grey-50-1000)]/[0.64] dark:bg-[var(--grey-1000-100)]/[0.64]",
];

const getStepLabel = (stepId: AnswerStepId) => {
  const { groupId, subGroupId } = STEP_TO_GROUP_MAPPING[stepId];

  return subGroupId
    ? `${STEP_GROUP_LABELS[groupId]} → ${STEP_GROUP_LABELS[subGroupId]}`
    : STEP_GROUP_LABELS[groupId];
};

export default function CascadingChangesAlert() {
  const { onConfirmStepCompletion, onCancelStepCompletion, selectPendingStepCompletion } =
    useProjectForm();

  const pendingStepCompletion = useAppSelector(selectPendingStepCompletion);

  if (!pendingStepCompletion?.showAlert) return null;

  const cascadingChanges = pendingStepCompletion.changes.cascadingChanges;

  const recomputedSteps = cascadingChanges?.filter(({ action }) => action === "recompute") ?? [];

  const deletedSteps = cascadingChanges?.filter(({ action }) => action === "delete") ?? [];

  const invalidSteps = cascadingChanges?.filter(({ action }) => action === "invalidate") ?? [];

  const validateTextButton =
    invalidSteps.length > 0 ? "Valider et compléter les étapes" : "Valider";

  return (
    <Dialog open={pendingStepCompletion.showAlert} onClose={onCancelStepCompletion}>
      <div className={classNames(DIALOG_DSFR_CSS)}>
        <DialogPanel className="max-w-3xl fr-modal__body">
          <div className="fr-modal__header">
            <button type="button" className="fr-btn--close fr-btn" onClick={onCancelStepCompletion}>
              Fermer
            </button>
          </div>
          <div className="fr-modal__content">
            <DialogTitle className="text-2xl">
              La modification de cette étape entraîne d’autres modifications.
            </DialogTitle>

            {deletedSteps.length > 0 && (
              <>
                <p className="my-4">Les étapes suivantes seront supprimées :</p>

                <ul className="w-full  mb-6 bg-background-ultralight list-none line-through py-2">
                  {deletedSteps.map(({ stepId }) => (
                    <li key={stepId} className="py-1">
                      {getStepLabel(stepId)}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {invalidSteps.length > 0 && (
              <>
                <p className="my-4">
                  Les étapes suivantes seront réinitialisées, vous devrez les compléter :
                </p>
                <ul className="w-full list-none py-2 mb-6 bg-warning-ultralight dark:bg-warning-ultradark text-warning-ultradark dark:text-warning-ultralight">
                  {invalidSteps.map(({ stepId }) => (
                    <li
                      key={stepId}
                      className={classNames(
                        "py-1",
                        "before:mr-2",
                        fr.cx("fr-icon-error-warning-fill"),
                      )}
                    >
                      {getStepLabel(stepId)}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {recomputedSteps.length > 0 && (
              <>
                <p className="my-4">
                  Bénéfriches recalculera automatiquement les montants suivants :
                </p>
                <ul className="w-full list-none py-2 mb-6 bg-success-ultralight dark:bg-success-ultradark text-success-ultradark dark:text-success-ultralight">
                  {recomputedSteps.map(({ stepId }) => (
                    <li
                      key={stepId}
                      className={classNames("py-1", "before:mr-2", fr.cx("fr-icon-check-line"))}
                    >
                      {getStepLabel(stepId)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="fr-modal__footer">
            <ButtonsGroup
              inlineLayoutWhen="always"
              alignment="right"
              buttons={[
                {
                  children: "Annuler la modification",
                  onClick: onCancelStepCompletion,
                  priority: "secondary",
                },
                { children: validateTextButton, onClick: onConfirmStepCompletion },
              ]}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
