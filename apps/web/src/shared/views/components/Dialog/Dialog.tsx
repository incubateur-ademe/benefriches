import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

type Props = {
  dialogId: string;
  title: ReactNode;
  children: ReactNode;
};
const Dialog = ({ dialogId, title, children }: Props) => {
  return (
    <dialog aria-labelledby={`${dialogId}-title`} id={dialogId} className={fr.cx("fr-modal")}>
      <div className={fr.cx("fr-container", "fr-container--fluid", "fr-container-md")}>
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
            {children}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
