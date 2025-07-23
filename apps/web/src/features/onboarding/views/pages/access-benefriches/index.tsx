import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import ProConnectButton from "@codegouvfr/react-dsfr/ProConnectButton";

import { routes, useRoute } from "@/shared/views/router";

import AuthLinkModal from "./AuthLinkModal";
import { authLinkModal } from "./createAuthLinkModal";

export default function AccessBenefrichesPage() {
  const currentRoute = useRoute();

  let loginUrl = "/api/auth/login/pro-connect";
  if (currentRoute.name === "accessBenefriches" && currentRoute.params.redirectTo) {
    loginUrl += `?redirectTo=${currentRoute.params.redirectTo}`;
  } else {
    loginUrl += `?redirectTo=${routes.myProjects().href}`;
  }

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <h1>Accéder à Bénéfriches</h1>

      <div className="tw-flex tw-flex-col lg:tw-flex-row tw-gap-8">
        <div className="tw-flex-1">
          <div className="tw-rounded-2xl tw-bg-grey-light dark:tw-bg-grey-dark tw-px-12 tw-py-9 tw-h-full tw-flex tw-flex-col tw-justify-center">
            <h2 className="tw-text-xl">Première fois sur Bénéfriches ?</h2>
            <div className="tw-mb-8">
              Découvrez Bénéfriches en quelques minutes et évaluez votre premier projet.
            </div>
            <Button linkProps={{ ...routes.onBoardingIdentity().link }}>Commencer</Button>
          </div>
        </div>

        {/* Separator */}
        <div className="tw-flex tw-items-center tw-justify-center lg:tw-flex-col">
          <span className="tw-font-medium tw-px-4 tw-py-2 tw-rounded-full tw-border tw-border-dsfr-border-default-grey">
            ou
          </span>
        </div>

        {/* Login section */}
        <div className="tw-flex-1">
          <div className="tw-rounded-2xl tw-bg-grey-light dark:tw-bg-grey-dark tw-px-12 tw-py-9 tw-h-full tw-flex tw-flex-col tw-justify-center">
            <h2 className="tw-text-xl tw-font-bold tw-mb-3">Vous avez déjà un compte ?</h2>
            <p className="tw-text-sm">
              Connectez-vous avec votre compte Pro Connect (anciennement Agent Connect).
            </p>
            <ProConnectButton url={loginUrl} />
            <span>
              <a
                href="#"
                role="button"
                onClick={() => {
                  authLinkModal.open();
                }}
                className="tw-text-sm"
              >
                Vous n'avez pas de compte Pro Connect ? Recevez un lien de connexion par mail.
              </a>
            </span>
          </div>
        </div>
      </div>
      <AuthLinkModal />
    </section>
  );
}
