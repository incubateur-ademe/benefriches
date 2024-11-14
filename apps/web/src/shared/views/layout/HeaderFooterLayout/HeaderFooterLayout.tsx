import { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { ReactNode } from "react";
import { Link } from "type-route";

import classNames from "@/shared/views/clsx";

import BenefrichesFooter from "./BenefrichesFooter";
import BenefrichesHeader from "./BenefrichesHeader";

type HeaderFooterLayoutProps = {
  children: ReactNode;
  headerProps?: Partial<HeaderProps> & {
    homeLinkPropsHref?: Link["href"];
    myProjectsLink?: Link;
  };
};

function HeaderFooterLayout({ children, headerProps = {} }: HeaderFooterLayoutProps) {
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
      <BenefrichesHeader {...headerProps} />
      <main className="tw-grow">{children}</main>
      <BenefrichesFooter />
    </div>
  );
}

export default HeaderFooterLayout;
