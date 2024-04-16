import { ReactNode } from "react";
import BenefrichesFooter from "./BenefrichesFooter";
import BenefrichesHeader from "./BenefrichesHeader";

import classNames from "@/shared/views/clsx";

type HeaderFooterLayoutProps = {
  children: ReactNode;
};

function HeaderFooterLayout({ children }: HeaderFooterLayoutProps) {
  return (
    <div className={classNames("tw-flex", "tw-flex-col", "tw-h-screen")}>
      <BenefrichesHeader />
      <main className="tw-grow">{children}</main>
      <BenefrichesFooter />
    </div>
  );
}

export default HeaderFooterLayout;
