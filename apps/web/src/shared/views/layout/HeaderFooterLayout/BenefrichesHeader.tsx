import { Header, HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { Link } from "type-route";

import { routes } from "@/shared/views/router";

import { useAppSelector } from "../../hooks/store.hooks";
// oxlint-disable-next-line no-unassigned-import
import "./BenefrichesHeader.css";

function BenefrichesHeader({
  homeLinkPropsHref = routes.home().href,
  myProjectsLink = routes.myEvaluations().link,
  ...props
}: Partial<HeaderProps> & { myProjectsLink?: Link; homeLinkPropsHref?: Link["href"] }) {
  const isUserLoggedIn = useAppSelector(
    (state) => state.currentUser.currentUserState === "authenticated",
  );

  const quickAccessItems: HeaderProps.QuickAccessItem[] = isUserLoggedIn
    ? [
        {
          iconId: "fr-icon-bar-chart-box-line",
          linkProps: myProjectsLink,
          text: "Mes évaluations",
        },
        {
          iconId: "fr-icon-logout-box-r-line",
          linkProps: { href: "/api/auth/logout" },
          text: "Se déconnecter",
        },
      ]
    : [
        {
          iconId: "fr-icon-logout-box-r-line",
          linkProps: routes.accessBenefriches().link,
          text: "Accéder à Bénéfriches",
        },
      ];

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
        alt: "Logo de l'ADEME et de Bénéfriches",
        imgUrl: "/img/logos/logo-ademe-and-benefriches.png",
        orientation: "horizontal",
      }}
      quickAccessItems={quickAccessItems}
      {...props}
    />
  );
}

export default BenefrichesHeader;
