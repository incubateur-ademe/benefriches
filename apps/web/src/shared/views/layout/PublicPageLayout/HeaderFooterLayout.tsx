import { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { ReactNode } from "react";
import { Link } from "type-route";

import BenefrichesFooter from "../BenefrichesFooter/BenefrichesFooter";
import BenefrichesHeader from "./BenefrichesHeader";

type HeaderFooterLayoutProps = {
  children: ReactNode;
  headerProps?: Partial<HeaderProps> & {
    homeLinkPropsHref?: Link["href"];
    myProjectsLink?: Link;
  };
};

function HeaderFooterLayout({ children, headerProps = {} }: HeaderFooterLayoutProps) {
  return (
    <>
      <SkipLinks
        links={[
          {
            anchor: "#contenu",
            label: "Contenu",
          },
          {
            anchor: "#footer",
            label: "Pied de page",
          },
        ]}
      />
      <BenefrichesHeader {...headerProps} />
      <main id="contenu" className="grow">
        {children}
      </main>
      <BenefrichesFooter />
    </>
  );
}

export default HeaderFooterLayout;
