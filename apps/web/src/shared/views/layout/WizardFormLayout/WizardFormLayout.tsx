import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import classNames from "../../clsx";

type Props = {
  title: ReactNode;
  instructions?: ReactNode;
  children: ReactNode;
};

function WizardFormLayout({ title, children, instructions = null }: Props) {
  return (
    <div className="tw-grid tw-grid-cols-12 tw-gap-6">
      <section className="tw-col-span-12 tw-col-start-1 md:tw-col-span-8">
        <h2>{title}</h2>
        {children}
      </section>
      {instructions && (
        <section
          className={classNames(
            fr.cx("fr-p-3w"),
            "md:tw-grid-start-8",
            "tw-col-span-12",
            "md:tw-col-span-4",
            "tw-bg-lightGrey",
            "dark:tw-bg-darkGrey",
          )}
        >
          <div className="*:tw-text-sm">{instructions}</div>
        </section>
      )}
    </div>
  );
}

export default WizardFormLayout;
