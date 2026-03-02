import Button from "@codegouvfr/react-dsfr/Button";
import { useEffect } from "react";

import { BENEFRICHES_ENV } from "@/app/envVars";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";
import { authenticateWithToken } from "@/features/onboarding/core/authenticateWithToken.action";
import { authTokenErrorHelpRequested } from "@/features/support/core/authTokenErrorHelpRequested.action";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

const DELAY_BEFORE_AUTHENTICATION = 1000; // 1 second

function AuthErrorHelp() {
  const dispatch = useAppDispatch();

  return (
    <div className="mt-4">
      <p className="mb-2">
        Vous pouvez{" "}
        <a className="fr-link" {...routes.accessBenefriches().link}>
          demander un nouveau lien de connexion
        </a>{" "}
        ou contacter notre support.
      </p>
      {/* TODO: display a "Contacter le support" button leading to support email address */}
      {/*  <a
          className="fr-link"
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Lien de connexion expiré")}`}
        >
          Contacter le support par email
        </a> */}
      {BENEFRICHES_ENV.crispEnabled && (
        <Button
          type="button"
          priority="secondary"
          iconId="ri-chat-3-line"
          onClick={() => {
            void dispatch(authTokenErrorHelpRequested());
          }}
        >
          Contacter le support
        </Button>
      )}
    </div>
  );
}

export default function AuthWithToken() {
  const currentRoute = useRoute();

  const postLoginRedirectTo =
    currentRoute.name === "authWithToken" && currentRoute.params.redirectTo
      ? currentRoute.params.redirectTo
      : routes.myEvaluations().href;
  const dispatch = useAppDispatch();
  const authenticationWithTokenState = useAppSelector(
    (state) => state.auth.authenticationWithTokenState,
  );

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      setTimeout(() => {
        void dispatch(authenticateWithToken({ token }));
      }, DELAY_BEFORE_AUTHENTICATION);
    }
  }, [dispatch]);

  useEffect(() => {
    if (authenticationWithTokenState === "success") {
      window.location.href = postLoginRedirectTo;
    }
  }, [authenticationWithTokenState, postLoginRedirectTo]);

  return (
    <section className="fr-container fr-py-4w">
      <HtmlTitle>Authentification par token</HtmlTitle>
      <h1>Authentification</h1>
      {authenticationWithTokenState === "error" ? (
        <>
          <p>Erreur lors de l'authentification.</p>
          <AuthErrorHelp />
        </>
      ) : (
        <LoadingSpinner loadingText="Authentification en cours..." />
      )}
    </section>
  );
}
