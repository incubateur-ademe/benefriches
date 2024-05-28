import { fr } from "@codegouvfr/react-dsfr";
import "@codegouvfr/react-dsfr/dsfr/utility/icons/icons-system/icons-system.css";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";

type Props = {
  siteId: string;
};

function NewScenarioTile({ siteId }: Props) {
  return (
    <div className="tw-border-dashed tw-border hover:tw-bg-lightGrey">
      <a
        {...routes.createProjectIntro({ siteId }).link}
        className={classNames(
          "tw-w-full",
          "tw-h-full",
          "tw-flex",
          "tw-flex-col",
          "tw-items-center",
          "tw-justify-center",
          "tw-min-h-64",
          "tw-text-dsfr-titleBlue",
          "tw-text-lg",
          "tw-bg-none",
        )}
      >
        <span aria-hidden="true" className={fr.cx("fr-icon--lg", "fr-icon-add-line")} />
        Nouveau scénario
      </a>
    </div>
  );
}

export default NewScenarioTile;
