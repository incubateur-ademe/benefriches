import { fr } from "@codegouvfr/react-dsfr";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { ReactNode } from "react";

import classNames from "../../clsx";

type Props = {
  dialogId: string;
  title: ReactNode;
  children: ReactNode;
  size?: "small" | "medium" | "large";
};
const Dialog = ({ dialogId, title, children, size = "medium" }: Props) => {
  const isOpen = useIsModalOpen({ id: dialogId, isOpenedByDefault: false });
  return (
    <dialog aria-labelledby={`${dialogId}-title`} id={dialogId} className={fr.cx("fr-modal")}>
      <div className={fr.cx("fr-container", "fr-container--fluid", "fr-container-md")}>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--center")}>
          <div
            className={classNames(
              fr.cx("fr-col-12"),
              size === "small" && fr.cx("fr-col-md-6"),
              size === "medium" && fr.cx("fr-col-md-8"),
            )}
          >
            <div className={fr.cx("fr-modal__body")}>
              <div className={fr.cx("fr-modal__header")}>
                <button
                  className={fr.cx("fr-btn--close", "fr-btn")}
                  aria-controls={dialogId}
                  type="button"
                >
                  Fermer
                </button>
              </div>
              <div className={fr.cx("fr-modal__content")}>
                <h2 className={fr.cx("fr-modal__title")} id={`${dialogId}-title`}>
                  {title}
                </h2>
                {isOpen && children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
