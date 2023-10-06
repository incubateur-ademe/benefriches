import { ReactNode } from "react";
import BenefrichesFooter from "./BenefrichesFooter";
import BenefrichesHeader from "./BenefrichesHeader";

type HeaderFooterLayoutProps = {
  children: ReactNode;
};

function HeaderFooterLayout({ children }: HeaderFooterLayoutProps) {
  return (
    <>
      <BenefrichesHeader />
      {children}
      <BenefrichesFooter />
    </>
  );
}

export default HeaderFooterLayout;
