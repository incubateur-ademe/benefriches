import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames from "../../clsx";

type Props = {
  children: ReactNode;
};

function FormWarning({ children }: Props) {
  return (
    <section
      className={classNames(
        "bg-warning-ultralight",
        "rounded-lg",
        "p-4",
        "md:sticky",
        "md:top-4",
        "flex",
        "flex-col",
        "gap-4",
        "*:mb-0",
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          "text-3xl text-warning-ultradark",
          fr.cx("fr-icon-error-warning-line"),
        )}
      ></span>
      {children}
    </section>
  );
}

export default FormWarning;
