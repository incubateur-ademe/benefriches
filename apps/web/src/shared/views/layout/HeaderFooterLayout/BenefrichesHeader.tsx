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
        imgUrl: "benefriches.png",
        orientation: "horizontal",
      }}
      quickAccessItems={[
        {
          iconId: "fr-icon-account-line",
          linkProps: routes.myProjects().link,
          text: "Mes projets",
        },
      ]}
    />
  );
}

export default BenefrichesHeader;
