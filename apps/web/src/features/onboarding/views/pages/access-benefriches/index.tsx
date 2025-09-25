import Button from "@codegouvfr/react-dsfr/Button";
import ProConnectButton from "@codegouvfr/react-dsfr/ProConnectButton";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { routes, useRoute } from "@/shared/views/router";

import AuthLinkModal from "./AuthLinkModal";
import { authLinkModal } from "./createAuthLinkModal";

export default function AccessBenefrichesPage() {
  const currentRoute = useRoute();

  const postLoginRedirectTo =
    currentRoute.name === "accessBenefriches" && currentRoute.params.redirectTo
      ? currentRoute.params.redirectTo
      : routes.myProjects().href;
  const loginUrl = `/api/auth/login/pro-connect?redirectTo=${postLoginRedirectTo}`;

  return (
    <section className="relative h-full">
      <HtmlTitle>Accéder à Bénéfriches</HtmlTitle>
      {/* Background layers - full width */}
      <div className="hidden absolute inset-0 md:grid md:grid-cols-2">
        <div className="bg-blue-light dark:bg-grey-dark"></div>
        <div className="bg-blue-medium dark:bg-blue-ultradark"></div>
      </div>

      <div className="relative h-full lg:min-h-[680px] fr-container grow md:grid md:grid-cols-16">
        <div className="col-span-10 flex flex-col gap-8 justify-center px-8 lg:pr-20 lg:pl-0 py-20 bg-blue-light dark:bg-grey-dark">
          <h1 className="leading-14 text-5xl mb-0">
            Connectez-vous à Bénéfriches pour évaluer les impacts de votre projet.
          </h1>
          <div className="flex gap-4 items-center">
            <div className="[&_.fr-connect-group_p]:hidden [&_.fr-connect]:mb-0">
              <ProConnectButton url={loginUrl} />
            </div>
            <Button
              priority="secondary"
              onClick={() => {
                authLinkModal.open();
              }}
            >
              Continuer avec mon adresse e-mail
            </Button>
          </div>
          <div className="flex gap-2 items-start">
            <p className="text-sm font-medium m-0">Nouveau sur Bénéfriches ?</p>
            <a
              className="text-sm font-medium"
              {...routes.onBoardingIdentity({ redirectTo: postLoginRedirectTo }).link}
            >
              Créer un compte
            </a>
          </div>
        </div>

        <div className="col-span-6 flex gap-8 flex-col justify-center items-start px-8 lg:pl-20 pr-6 lg:pr-0 py-10 bg-blue-medium dark:bg-blue-ultradark">
          <img src="/img/logos/logo-proconnect.svg" height="90" alt="" />
          <h2 className="text-[28px] leading-9 mb-0">Pourquoi se connecter avec ProConnect ?</h2>
          <ul className="text-sm font-medium space-y-3 list-none p-0 m-0">
            <li className="relative pl-6 before:content-['✔️'] before:absolute before:left-0">
              La fusion de MonComptePro et AgentConnect
            </li>
            <li className="relative pl-6 before:content-['✔️'] before:absolute before:left-0">
              Un identifiant créé à partir de votre adresse mail professionnelle (entreprise ou
              collectivité)
            </li>
            <li className="relative pl-6 before:content-['✔️'] before:absolute before:left-0">
              + de 120 services numériques accessibles en seulement un clic
            </li>
          </ul>
          <ExternalLink href="https://www.proconnect.gouv.fr/" className="text-sm">
            En savoir plus sur ProConnect
          </ExternalLink>
        </div>
      </div>
      <AuthLinkModal postLoginRedirectTo={postLoginRedirectTo} />
    </section>
  );
}
