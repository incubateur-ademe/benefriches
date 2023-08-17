import { Header } from "@codegouvfr/react-dsfr/Header";
import { routes } from "../../../router";

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
      navigation={[
        {
          linkProps: routes.home().link,
          text: "Accueil",
          isActive: true,
        },
      ]}
      serviceTitle="Bénéfriches"
    />
  );
}

export default BenefrichesHeader;
