import { Header, HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { Link } from "type-route";

import { routes } from "@/shared/views/router";

function BenefrichesHeader({
  homeLinkPropsHref = routes.home().href,
  myProjectsLink = routes.myProjects().link,
  ...props
}: Partial<HeaderProps> & { myProjectsLink?: Link; homeLinkPropsHref?: Link["href"] }) {
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
      quickAccessItems={[
        {
          iconId: "fr-icon-briefcase-fill",
          linkProps: myProjectsLink,
          text: "Mes projets",
        },
      ]}
      {...props}
    />
  );
}

export default BenefrichesHeader;
