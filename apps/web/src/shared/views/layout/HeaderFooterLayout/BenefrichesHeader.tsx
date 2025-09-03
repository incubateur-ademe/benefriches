import { Header, HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { Link } from "type-route";

import { routes } from "@/shared/views/router";

import { useAppSelector } from "../../hooks/store.hooks";

function BenefrichesHeader({
  homeLinkPropsHref = routes.home().href,
  myProjectsLink = routes.myProjects().link,
  ...props
}: Partial<HeaderProps> & { myProjectsLink?: Link; homeLinkPropsHref?: Link["href"] }) {
  const isUserLoggedIn = useAppSelector(
    (state) => state.currentUser.currentUserState === "authenticated",
  );

  return (
    <Header
      brandTop={
        <>
          RÉPUBLIQUE
          <br />
          FRANÇAISE
        </>
      }
      homeLinkProps={{
        href: homeLinkPropsHref,
        title: "Accueil - Bénéfriches",
      }}
      operatorLogo={{
        alt: "Logo de Bénéfriches",
        imgUrl: "/img/logos/logo-benefriches-simple.svg",
        orientation: "horizontal",
      }}
      quickAccessItems={
        isUserLoggedIn
          ? [
              {
                iconId: "fr-icon-briefcase-fill",
                linkProps: myProjectsLink,
                text: "Mes projets",
              },
              // {
              //   iconId: "fr-icon-logout-box-r-line",
              //   linkProps: { href: "api/auth/logout" },
              //   text: "Se déconnecter",
              // },
            ]
          : [
              {
                iconId: "fr-icon-logout-box-r-line",
                linkProps: routes.accessBenefriches().link,
                text: "Accéder à Bénéfriches",
              },
            ]
      }
      {...props}
    />
  );
}

export default BenefrichesHeader;
