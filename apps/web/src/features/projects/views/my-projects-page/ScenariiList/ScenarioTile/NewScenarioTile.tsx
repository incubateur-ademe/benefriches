import { fr } from "@codegouvfr/react-dsfr";
import "@codegouvfr/react-dsfr/dsfr/utility/icons/icons-system/icons-system.css";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";

type Props = {
  siteId: string;
};

function NewScenarioTile({ siteId }: Props) {
  return (
    <a
      {...routes.createProjectIntro({ siteId }).link}
      className={classNames(
        "tw-w-full",
        "tw-border-dashed",
        "tw-border",
        "tw-h-full",
        "tw-flex",
        "tw-flex-col",
        "tw-items-center",
        "tw-justify-center",
        "tw-min-h-64",
        "tw-text-dsfr-titleBlue",
        "tw-bg-none",
        "hover:tw-font-bold",
        "hover:tw-border-solid",
      )}
    >
      <span aria-hidden="true" className={fr.cx("fr-icon--lg", "fr-icon-add-line")}></span>
      Nouveau scénario
    </a>
  );
}

export default NewScenarioTile;
