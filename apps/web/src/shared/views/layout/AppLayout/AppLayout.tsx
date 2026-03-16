import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { ReactNode } from "react";

import BenefrichesFooter from "../BenefrichesFooter/BenefrichesFooter";
import AppHeader, { AppLayoutHeaderProps } from "./AppHeader";

type AppLayoutProps = {
  children: ReactNode;
  headerProps?: AppLayoutHeaderProps;
};

function AppLayout({ children, headerProps = {} }: AppLayoutProps) {
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
      <AppHeader {...headerProps} />
      <main id="contenu" className="grow">
        {children}
      </main>
      <BenefrichesFooter />
    </>
  );
}

export default AppLayout;
