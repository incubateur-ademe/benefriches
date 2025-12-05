import { ReactNode } from "react";

import classNames from "../../clsx";
import FormWarning from "./FormWarning";

export type WizardFormLayoutProps = {
  title: ReactNode;
  instructions?: ReactNode;
  warnings?: ReactNode;
  children: ReactNode;
  fullScreen?: boolean;
};

function WizardFormLayout({
  title,
  children,
  instructions = null,
  warnings = null,
  fullScreen = false,
}: WizardFormLayoutProps) {
  const hasRightPanelContent = instructions || warnings;
  const shouldDisplayFullScreen = fullScreen && !hasRightPanelContent;

  return (
    <div className="grid grid-cols-12 gap-6 w-full">
      <section
        className={classNames(
          "col-span-12",
          "col-start-1",
          !shouldDisplayFullScreen && "md:col-span-8",
        )}
      >
        <div className="md:px-6">
          <h2>{title}</h2>
          {children}
        </div>
      </section>
      {hasRightPanelContent && (
        <section className={classNames("md:grid-start-8", "col-span-12", "md:col-span-4")}>
          <div
            className={classNames(
              "flex",
              "flex-col",
              "gap-4",
              "md:sticky",
              "md:top-(--sidebar-layout-sticky-top-offset)",
            )}
          >
            {warnings && <FormWarning>{warnings}</FormWarning>}
            {instructions && (
              <div
                className={classNames(
                  "border-border-grey",
                  "border-solid",
                  "border",
                  "shadow-md",
                  "rounded-lg",
                  "p-4",
                )}
              >
                {instructions}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default WizardFormLayout;
