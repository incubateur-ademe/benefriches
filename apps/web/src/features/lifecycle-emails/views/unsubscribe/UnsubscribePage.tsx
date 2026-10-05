import Button from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/router";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import type { LifecycleEmailsUnsubscribeViewData } from "../../core/lifecycleEmailsUnsubscribe.selectors";

type Props = {
  viewData: LifecycleEmailsUnsubscribeViewData;
  onRetry: () => void;
};

// TODO(product): confirm the wording of every state below (draft, not in the mockups).
function UnsubscribePage({ viewData, onRetry }: Props) {
  return (
    <section className="fr-container fr-py-4w">
      {(() => {
        switch (viewData.status) {
          case "loading":
            return (
              <>
                <HtmlTitle>Désinscription</HtmlTitle>
                <LoadingSpinner loadingText="Désinscription en cours…" />
              </>
            );
          case "success":
            return (
              <>
                <HtmlTitle>Désinscription confirmée</HtmlTitle>
                <h1>Désinscription confirmée</h1>
                <p>
                  Vous ne recevrez plus les e-mails d’accompagnement et de résultats d’impacts de
                  Bénéfriches.
                </p>
                <p>Les e-mails de connexion que vous demandez continueront d’arriver.</p>
                <a className="fr-link" {...routes.home().link}>
                  Aller sur Bénéfriches
                </a>
              </>
            );
          case "error":
            return viewData.reason === "invalid-link" ? (
              <>
                <HtmlTitle>Lien de désinscription invalide</HtmlTitle>
                <h1>Ce lien de désinscription ne fonctionne pas</h1>
                <p>
                  Il est peut-être incomplet. Cliquez à nouveau sur « vous désinscrire » en bas de
                  l’un de nos e-mails, ou copiez le lien en entier dans votre navigateur.
                </p>
                <p>Vos préférences n’ont pas été modifiées.</p>
                {/* TODO(product): confirm the contact channel (support e-mail address or chat). */}
                <p>Si le problème persiste, contactez l’équipe Bénéfriches.</p>
              </>
            ) : (
              <>
                <HtmlTitle>La désinscription n’a pas abouti</HtmlTitle>
                <h1>La désinscription n’a pas abouti</h1>
                <p>
                  Une erreur technique nous a empêchés d’enregistrer votre demande. Réessayez dans
                  quelques instants.
                </p>
                <Button onClick={onRetry}>Réessayer</Button>
              </>
            );
        }
      })()}
    </section>
  );
}

export default UnsubscribePage;
