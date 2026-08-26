import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  size?: "large" | "medium" | "small";
};

const ModalBody = ({ children, size = "medium" }: Props) => {
  return (
    <div className={fr.cx("fr-container", "fr-container--fluid", "fr-container-md")}>
      <div className={fr.cx("fr-grid-row", "fr-grid-row--center")}>
        <div
          className={classNames(
            size === "medium" && ["fr-col-12", "fr-col-md-10", "fr-col-lg-8"],
            size === "large" && ["fr-col-12"],
            size === "small" && ["fr-col-12", "fr-col-md-8", "fr-col-lg-6"],
          )}
        >
          <div className={classNames(fr.cx("fr-modal__body"), "mb-24")}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalBody;
