import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames from "../../clsx";

type Props = {
  children: ReactNode;
};

function FormWarning({ children }: Props) {
  return (
    <div
      className={classNames(
        "bg-warning-ultralight",
        "dark:bg-warning-ultradark",
        "rounded-lg",
        "p-4",
        "flex",
        "flex-col",
        "gap-4",
        "*:mb-0",
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          "text-3xl text-warning-ultradark dark:text-warning-ultralight",
          fr.cx("fr-icon-error-warning-line"),
        )}
      ></span>
      {children}
    </div>
  );
}

export default FormWarning;
