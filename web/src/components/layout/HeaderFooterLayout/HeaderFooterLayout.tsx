import { ReactNode } from "react";
import BenefrichesHeader from "./BenefrichesHeader";
import BenefrichesFooter from "./BenefrichesFooter";

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
