import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useCallback } from "react";
import { useSelector } from "react-redux";

import {
  cancelStepCompletion,
  confirmStepCompletion,
} from "@/features/create-project/core/urban-project/urbanProject.actions";
import { AnswerStepId } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import { RootState } from "@/shared/core/store-config/store";
import classNames from "@/shared/views/clsx";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import { STEP_LABELS, STEP_TO_CATEGORY_MAPPING } from "./stepper/stepperConfig";

const DIALOG_DSFR_CSS = [
  "fixed inset-0",
  "w-screen ",
  "flex items-center justify-center",
  "z-[1750]",
  "bg-[var(--grey-50-1000)]/[0.64] dark:bg-[var(--grey-1000-100)]/[0.64]",
];

const getStepLabel = (stepId: AnswerStepId) => {
  const { categoryKey, subCategoryKey } = STEP_TO_CATEGORY_MAPPING[stepId];

  return subCategoryKey
    ? `${STEP_LABELS[categoryKey]} → ${STEP_LABELS[subCategoryKey]}`
    : STEP_LABELS[categoryKey];
};

export default function CascadingChangesAlert() {
  const pendingStepCompletion = useSelector(
    (state: RootState) => state.projectCreation.urbanProject.pendingStepCompletion,
  );

  const dispatch = useAppDispatch();

  const onConfirm = useCallback(() => {
    dispatch(confirmStepCompletion());
  }, [dispatch]);

  const onCancel = useCallback(() => {
    dispatch(cancelStepCompletion());
  }, [dispatch]);

  if (!pendingStepCompletion?.showAlert) return null;

  const cascadingChanges = pendingStepCompletion.changes.cascadingChanges;

  const deletedOrRecomputedSteps =
    cascadingChanges?.filter(({ action }) => action === "recompute" || action === "delete") ?? [];

  const invalidSteps = cascadingChanges?.filter(({ action }) => action === "invalidate") ?? [];

  return (
    <Dialog open={pendingStepCompletion.showAlert} onClose={onCancel}>
      <div className={classNames(DIALOG_DSFR_CSS)}>
        <DialogPanel className="max-w-2xl fr-modal__body">
          <div className="fr-modal__header">
            <button type="button" className="fr-btn--close fr-btn" onClick={onCancel}>
              Fermer
            </button>
          </div>
          <div className="fr-modal__content">
            <DialogTitle>
              <span aria-hidden="true">⚠️</span> Modification de la réponse
            </DialogTitle>

            <Description>
              Cette modification va affecter {cascadingChanges?.length} étape(s) déjà remplies.
            </Description>

            {invalidSteps.length > 0 && (
              <div>
                <strong>Étapes qui seront réinitialisées et que vous devrez re-compléter :</strong>
                <ul>
                  {invalidSteps.map(({ stepId }) => (
                    <li key={stepId}>{getStepLabel(stepId)}</li>
                  ))}
                </ul>
              </div>
            )}

            {deletedOrRecomputedSteps.length > 0 && (
              <div>
                <strong>
                  Étapes qui seront automatiquement supprimées, complétées ou recalculées :
                </strong>
                <ul>
                  {deletedOrRecomputedSteps.map(({ stepId }) => (
                    <li key={stepId}>{getStepLabel(stepId)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="fr-modal__footer">
            <ButtonsGroup
              inlineLayoutWhen="always"
              alignment="right"
              buttons={[
                { children: "Annuler", onClick: onCancel, priority: "secondary" },
                { children: "Valider", onClick: onConfirm },
              ]}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
