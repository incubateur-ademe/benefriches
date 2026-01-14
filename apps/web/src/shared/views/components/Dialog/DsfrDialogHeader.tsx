import { fr } from "@codegouvfr/react-dsfr";
import { useContext } from "react";

import classNames from "../../clsx";
import { DsfrDialogContext } from "./DsfrDialogContext";

const DsfrDialogHeader = () => {
  const { dialogId } = useContext(DsfrDialogContext);

  return (
    <div className={classNames(fr.cx("fr-modal__header"), "px-10")}>
      <button className={fr.cx("fr-btn--close", "fr-btn")} aria-controls={dialogId} type="button">
        Fermer
      </button>
    </div>
  );
};

export default DsfrDialogHeader;
