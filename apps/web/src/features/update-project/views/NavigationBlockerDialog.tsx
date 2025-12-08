import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import classNames from "@/shared/views/clsx";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useNavigationBlocker } from "@/shared/views/hooks/useNavigationBlocker";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";
import { routes } from "@/shared/views/router";

const DIALOG_DSFR_CSS = [
  "fixed inset-0",
  "w-screen",
  "flex items-center justify-center",
  "z-[1750]",
  "bg-[var(--grey-50-1000)]/[0.64] dark:bg-[var(--grey-1000-100)]/[0.64]",
];

export default function NavigationBlockerDialog() {
  const { selectSaveState, selectIsFormStatusValid, onSave } = useProjectForm();

  const saveState = useAppSelector(selectSaveState);
  const isFormValid = useAppSelector(selectIsFormStatusValid);

  const { isModalOpened, onConfirmNavigation, onCancelNavigation } = useNavigationBlocker({
    shouldBlockNavigation: saveState === "dirty",
    allowRoute: (route) => route.name === routes.updateProject.name,
  });

  return (
    <Dialog open={isModalOpened} onClose={onCancelNavigation}>
      <div className={classNames(DIALOG_DSFR_CSS)}>
        <DialogPanel className="max-w-4xl fr-modal__body">
          <div className="fr-modal__header">
            <button type="button" className="fr-btn--close fr-btn" onClick={onCancelNavigation}>
              Fermer
            </button>
          </div>
          {isFormValid ? (
            <>
              <div className="fr-modal__content">
                <DialogTitle className="text-2xl">
                  <span className="flex mb-2" aria-hidden="true">
                    ⚠️
                  </span>
                  Souhaitez-vous sauvegarder les modifications avant de retourner aux impacts ?
                </DialogTitle>
                <Description>
                  Si vous ne sauvegardez pas vos modifications,{" "}
                  <strong>celles-ci seront perdues.</strong>
                </Description>
              </div>

              <div className="fr-modal__footer flex flex-col items-end gap-1">
                <div className="flex flex-wrap gap-4 items-end">
                  <Button
                    priority="secondary"
                    iconId="ri-bar-chart-box-line"
                    onClick={onConfirmNavigation}
                  >
                    Retourner aux impacts sans sauvegarder
                  </Button>
                  <Button
                    priority="primary"
                    iconId="fr-icon-save-line"
                    onClick={() => {
                      onSave();
                      onConfirmNavigation();
                    }}
                  >
                    Sauvegarder et retourner aux impacts
                  </Button>
                </div>
                <Button
                  priority="tertiary no outline"
                  iconId="ri-pencil-fill"
                  onClick={onCancelNavigation}
                >
                  Reprendre la modification
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="fr-modal__content">
                <DialogTitle className="text-2xl">
                  <span className="flex mb-2" aria-hidden="true">
                    ⚠️
                  </span>
                  Êtes-vous sur·e de vouloir retourner aux impacts de votre projet sans sauvegarder
                  les modifications ?
                </DialogTitle>

                <Description>
                  Votre modification comporte des erreurs et ne peut pas être sauvegardée. En
                  retournant aux impacts, <strong>vos modifications seront perdues.</strong>
                </Description>
              </div>
              <div className="fr-modal__footer flex flex-col items-end">
                <ButtonsGroup
                  inlineLayoutWhen="always"
                  alignment="right"
                  buttons={[
                    {
                      children: "Reprendre la modification",
                      iconId: "ri-pencil-fill",
                      onClick: onCancelNavigation,
                      priority: "secondary",
                    },
                    {
                      children: "Retourner aux impacts",
                      iconId: "ri-bar-chart-box-line",
                      onClick: onConfirmNavigation,
                    },
                  ]}
                />
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
