import { Header } from "@codegouvfr/react-dsfr/Header";

import { routes } from "@/app/views/router";

function BenefrichesHeader() {
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
        href: "/",
        title: "Accueil - Bénéfriches",
      }}
      operatorLogo={{
        alt: "Logo de Bénéfriches",
        imgUrl: "/img/logos/logo-benefriches.svg",
        orientation: "horizontal",
      }}
      quickAccessItems={[
        {
          iconId: "fr-icon-briefcase-fill",
          linkProps: routes.myProjects().link,
          text: "Mes projets",
        },
      ]}
    />
  );
}

export default BenefrichesHeader;
