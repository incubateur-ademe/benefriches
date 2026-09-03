import Button from "@codegouvfr/react-dsfr/Button";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Route } from "type-route";

import { routes } from "@/app/router";
import classNames from "@/shared/views/clsx";
import { useBeforeUnloadWarning } from "@/shared/views/hooks/useBeforeUnloadWarning";
import { useNavigationBlocker } from "@/shared/views/hooks/useNavigationBlocker";

const DIALOG_DSFR_CSS = [
  "fixed inset-0",
  "w-screen",
  "flex items-center justify-center",
  "z-[1750]",
  "bg-[var(--grey-50-1000)]/[0.64] dark:bg-[var(--grey-1000-100)]/[0.64]",
];

// Hoisted to module scope: `allowRoute` sits in `useNavigationBlocker`'s effect dependency array,
// so an inline arrow here would tear down and re-register the `session.block` subscription on
// every render. This is what lets step-to-step navigation inside the wizard (and the summary
// "Modifier" links, which route back into the wizard) pass through unblocked.
const isUpdateSiteRoute = (route: Route<typeof routes>) => route.name === routes.updateSite.name;

export default function SiteUpdateNavigationBlockerDialog({
  shouldBlock,
}: {
  shouldBlock: boolean;
}) {
  const { isModalOpened, onConfirmNavigation, onCancelNavigation } = useNavigationBlocker({
    shouldBlockNavigation: shouldBlock,
    allowRoute: isUpdateSiteRoute,
  });

  useBeforeUnloadWarning(shouldBlock);

  return (
    <Dialog open={isModalOpened} onClose={onCancelNavigation}>
      <div className={classNames(DIALOG_DSFR_CSS)}>
        <DialogPanel className="max-w-4xl fr-modal__body">
          <div className="fr-modal__header">
            <button type="button" className="fr-btn--close fr-btn" onClick={onCancelNavigation}>
              Fermer
            </button>
          </div>
          <div className="fr-modal__content">
            <DialogTitle className="text-2xl">
              <span className="flex mb-2" aria-hidden="true">
                ⚠️
              </span>
              Êtes-vous sûr·e de vouloir quitter sans sauvegarder ?
            </DialogTitle>
            <Description>
              Les modifications que vous avez saisies <strong>ne seront pas sauvegardées</strong>.
            </Description>
          </div>

          <div className="fr-modal__footer flex flex-col items-end gap-1">
            <div className="flex flex-wrap gap-4 items-end">
              <Button priority="secondary" onClick={onCancelNavigation}>
                Reprendre la modification
              </Button>
              <Button priority="primary" onClick={onConfirmNavigation}>
                Quitter sans sauvegarder
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
