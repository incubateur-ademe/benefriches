import { ReactNode } from "react";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import BenefrichesFooter from "./BenefrichesFooter";
import BenefrichesHeader from "./BenefrichesHeader";

import classNames from "@/shared/views/clsx";

type HeaderFooterLayoutProps = {
  children: ReactNode;
};

function HeaderFooterLayout({ children }: HeaderFooterLayoutProps) {
  const { isDark } = useIsDark();
  return (
    <div
      className={classNames(
        "tw-flex",
        "tw-flex-col",
        "tw-h-screen",
        // Force highchart à suivre la config dsfr pour le dark mode,
        // sinon la lib suit la config du navigateur "prefers-color-scheme"
        isDark ? "highcharts-dark" : "highcharts-light",
      )}
    >
      <BenefrichesHeader />
      <main className="tw-grow">{children}</main>
      <BenefrichesFooter />
    </div>
  );
}

export default HeaderFooterLayout;
