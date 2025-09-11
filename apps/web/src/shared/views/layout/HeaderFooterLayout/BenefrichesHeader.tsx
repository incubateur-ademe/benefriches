import { Header, HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { Link } from "type-route";

import { routes } from "@/shared/views/router";

import { BENEFRICHES_ENV } from "../../envVars";
import { useAppSelector } from "../../hooks/store.hooks";

function BenefrichesHeader({
  homeLinkPropsHref = routes.home().href,
  myProjectsLink = routes.myProjects().link,
  ...props
}: Partial<HeaderProps> & { myProjectsLink?: Link; homeLinkPropsHref?: Link["href"] }) {
  const isUserLoggedIn = useAppSelector(
    (state) => state.currentUser.currentUserState === "authenticated",
  );

  const quickAccessItems: HeaderProps.QuickAccessItem[] = [];

  if (isUserLoggedIn) {
    quickAccessItems.push({
      iconId: "fr-icon-briefcase-fill",
      linkProps: myProjectsLink,
      text: "Mes projets",
    });

    if (BENEFRICHES_ENV.authEnabled) {
      quickAccessItems.push({
        iconId: "fr-icon-logout-box-r-line",
        linkProps: { href: "/api/auth/logout" },
        text: "Se déconnecter",
      });
    }
  } else {
    quickAccessItems.push({
      iconId: "fr-icon-logout-box-r-line",
      linkProps: BENEFRICHES_ENV.authEnabled
        ? routes.accessBenefriches().link
        : routes.onBoardingIdentity().link,
      text: "Accéder à Bénéfriches",
    });
  }

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
      quickAccessItems={quickAccessItems}
      {...props}
    />
  );
}

export default BenefrichesHeader;
