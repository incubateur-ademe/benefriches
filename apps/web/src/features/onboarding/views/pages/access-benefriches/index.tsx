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

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="rounded-2xl bg-grey-light dark:bg-grey-dark px-12 py-9 h-full flex flex-col justify-center">
            <h2 className="text-xl">Première fois sur Bénéfriches ?</h2>
            <div className="mb-8">
              Découvrez Bénéfriches en quelques minutes et évaluez votre premier projet.
            </div>
            <Button linkProps={{ ...routes.onBoardingIdentity().link }}>Commencer</Button>
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center lg:flex-col">
          <span className="font-medium px-4 py-2 rounded-full border border-dsfr-border-default-grey">
            ou
          </span>
        </div>

        {/* Login section */}
        <div className="flex-1">
          <div className="rounded-2xl bg-grey-light dark:bg-grey-dark px-12 py-9 h-full flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-3">Vous avez déjà un compte ?</h2>
            <p className="text-sm">
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
                className="text-sm"
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
