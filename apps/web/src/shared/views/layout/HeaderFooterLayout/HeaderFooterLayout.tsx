import { ReactNode } from "react";
import BenefrichesFooter from "./BenefrichesFooter";
import BenefrichesHeader from "./BenefrichesHeader";

type HeaderFooterLayoutProps = {
  children: ReactNode;
};

function HeaderFooterLayout({ children }: HeaderFooterLayoutProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <BenefrichesHeader />
      <main style={{ flexGrow: 1 }}>{children}</main>
      <BenefrichesFooter />
    </div>
  );
}

export default HeaderFooterLayout;
