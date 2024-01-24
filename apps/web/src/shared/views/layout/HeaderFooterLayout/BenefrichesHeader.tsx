import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Header } from "@codegouvfr/react-dsfr/Header";

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
      // navigation={[
      //   {
      //     linkProps: routes.myProjects().link,
      //     text: "Mes projets",
      //     isActive: true,
      //   },
      // ]}
      serviceTitle="Bénéfriches"
      serviceTagline={
        <Badge small noIcon severity="new" as="span">
          En construction
        </Badge>
      }
    />
  );
}

export default BenefrichesHeader;
