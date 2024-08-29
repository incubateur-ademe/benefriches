import { ReactNode } from "react";
import classNames from "../../clsx";

type Props = {
  title: ReactNode;
  instructions?: ReactNode;
  children: ReactNode;
};

function WizardFormLayout({ title, children, instructions = null }: Props) {
  return (
    <div className="tw-grid tw-grid-cols-12 tw-gap-6 tw-w-full">
      <section className="tw-col-span-12 tw-col-start-1 md:tw-col-span-8">
        <div className="tw-px-6">
          <h2>{title}</h2>
          {children}
        </div>
      </section>
      {instructions && (
        <section className={classNames("md:tw-grid-start-8", "tw-col-span-12", "md:tw-col-span-4")}>
          <div
            className={classNames(
              "tw-border-borderGrey",
              "tw-border-solid",
              "tw-border",
              "tw-shadow-md",
              "tw-rounded-lg",
              "tw-p-4",
              "md:tw-sticky",
              "md:tw-top-4",
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
