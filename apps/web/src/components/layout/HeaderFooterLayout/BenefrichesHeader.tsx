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
      navigation={[
        {
          linkProps: {
            href: "#",
            target: "_self",
          },
          text: "Accueil",
          isActive: true,
        },
      ]}
      serviceTitle="Bénéfriches"
    />
  );
}

export default BenefrichesHeader;
