import { useEffect } from "react";

import { authenticateWithToken } from "@/features/onboarding/core/authenticateWithToken.action";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes, useRoute } from "@/shared/views/router";

const DELAY_BEFORE_AUTHENTICATION = 1000; // 1 second

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
        <p>Erreur lors de l'authentification.</p>
      ) : (
        <LoadingSpinner loadingText="Authentification en cours..." />
      )}
    </section>
  );
}
