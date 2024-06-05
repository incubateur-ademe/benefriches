import { ReactNode } from "react";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";

import classNames from "@/shared/views/clsx";

type FormLayoutProps = {
  children: ReactNode;
};

function SidebarContainerLayout({ children }: FormLayoutProps) {
  const { isDark } = useIsDark();
  return (
    <section
      className={classNames(
        "tw-flex",
        "tw-h-screen",
        "tw-items-center",
        "tw-justify-center",
        "tw-w-full",
        "tw-overflow-hidden",
        // Force highchart à suivre la config dsfr pour le dark mode,
        // sinon la lib suit la config du navigateur "prefers-color-scheme"
        isDark ? "highcharts-dark" : "highcharts-light",
      )}
    >
      {children}
    </section>
  );
}

export default SidebarContainerLayout;
