import Button from "@codegouvfr/react-dsfr/Button";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import classNames from "@/shared/views/clsx";
import { useNavigationBlocker } from "@/shared/views/hooks/useNavigationBlocker";
import { routes } from "@/shared/views/router";

const DIALOG_DSFR_CSS = [
  "fixed inset-0",
  "w-screen",
  "flex items-center justify-center",
  "z-[1750]",
  "bg-[var(--grey-50-1000)]/[0.64] dark:bg-[var(--grey-1000-100)]/[0.64]",
];

export default function NavigationBlockerDialog({ shouldBlock }: { shouldBlock: boolean }) {
  const { isModalOpened, onConfirmNavigation, onCancelNavigation } = useNavigationBlocker({
    shouldBlockNavigation: shouldBlock,
    allowRoute: (route) => route.name === routes.createProject.name,
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
          <>
            <div className="fr-modal__content">
              <DialogTitle className="text-2xl">
                <span className="flex mb-2" aria-hidden="true">
                  ⚠️
                </span>
                Êtes-vous sûr·e de vouloir quitter le formulaire ?
              </DialogTitle>
              <Description>
                Les informations que vous avez saisies <strong>ne seront pas sauvegardées</strong>.
                <br />
                Vous devez aller jusqu’au bout du formulaire “Renseignement du projet” pour que le
                projet soit créé.
              </Description>
            </div>

            <div className="fr-modal__footer flex flex-col items-end gap-1">
              <div className="flex flex-wrap gap-4 items-end">
                <Button priority="secondary" onClick={onCancelNavigation}>
                  Rester sur le formulaire
                </Button>
                <Button priority="primary" onClick={onConfirmNavigation}>
                  Quitter
                </Button>
              </div>
            </div>
          </>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
