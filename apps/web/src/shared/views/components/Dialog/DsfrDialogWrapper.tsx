import { fr } from "@codegouvfr/react-dsfr";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

import classNames from "../../clsx";
import { DsfrDialogContext } from "./DsfrDialogContext";

type Props = {
  dialogId: string;
  children: ReactNode;
  onDisclose?: () => void;
  onConceal?: () => void;
  size?: "small" | "medium" | "large";
};
const DsfrDialogWrapper = ({
  dialogId,
  children,
  size = "medium",
  onDisclose,
  onConceal,
}: Props) => {
  const isOpened = useIsModalOpen(
    { id: dialogId, isOpenedByDefault: false },
    { onDisclose, onConceal },
  );

  return createPortal(
    <DsfrDialogContext.Provider value={{ isOpened, dialogId, dialogTitleId: `${dialogId}-title` }}>
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
              <div className={fr.cx("fr-modal__body")}>{children}</div>
            </div>
          </div>
        </div>
      </dialog>
    </DsfrDialogContext.Provider>,
    document.body,
  );
};

export default DsfrDialogWrapper;
