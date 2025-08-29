import { ReactNode } from "react";

import classNames from "../../clsx";

type Props = {
  title: ReactNode;
  instructions?: ReactNode;
  children: ReactNode;
  fullScreen?: boolean;
};

function WizardFormLayout({ title, children, instructions = null, fullScreen = false }: Props) {
  const shouldDisplayFullScreen = fullScreen && !instructions;

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
      {instructions && (
        <section className={classNames("md:grid-start-8", "col-span-12", "md:col-span-4")}>
          <div
            className={classNames(
              "border-borderGrey",
              "border-solid",
              "border",
              "shadow-md",
              "rounded-lg",
              "p-4",
              "md:sticky",
              "md:top-4",
            )}
          >
            {instructions}
          </div>
        </section>
      )}
    </div>
  );
}

export default WizardFormLayout;
