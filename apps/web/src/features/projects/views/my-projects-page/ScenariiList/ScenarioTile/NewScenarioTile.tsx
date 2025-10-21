import { fr } from "@codegouvfr/react-dsfr";
// oxlint-disable-next-line no-unassigned-import
import "@codegouvfr/react-dsfr/dsfr/utility/icons/icons-system/icons-system.css";
import { Link } from "type-route";

import classNames from "@/shared/views/clsx";

type Props = {
  linkProps?: Link;
};

function NewScenarioTile({ linkProps }: Props) {
  return (
    <div
      className={classNames(
        "tour-guide-step-create-new-project",
        "border-dashed",
        "border",
        "rounded-lg",
        "hover:bg-grey-light dark:hover:bg-grey-dark",
      )}
    >
      <a
        {...linkProps}
        className={classNames(
          "w-full",
          "h-full",
          "flex",
          "flex-col",
          "items-center",
          "justify-center",
          "min-h-64",
          "text-dsfr-title-blue",
          "text-lg",
          "bg-none",
        )}
      >
        <span aria-hidden="true" className={fr.cx("fr-icon--lg", "fr-icon-add-line")} />
        Nouveau scénario
      </a>
    </div>
  );
}

export default NewScenarioTile;
