import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames from "../../clsx";

type Props = {
  children: ReactNode;
};

function FormError({ children }: Props) {
  return (
    <div
      className={classNames(
        "bg-error-ultralight",
        "dark:bg-error-ultradark",
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
          "text-3xl text-error-ultradark dark:text-error-ultralight",
          fr.cx("fr-icon-error-fill"),
        )}
      ></span>
      {children}
    </div>
  );
}

export default FormError;
