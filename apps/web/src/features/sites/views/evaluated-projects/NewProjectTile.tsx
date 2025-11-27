import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";
import { routes } from "@/shared/views/router";

type Props = {
  siteId: string;
};

function NewProjectTile({ siteId }: Props) {
  return (
    <a
      {...routes.createProject({ siteId }).link}
      className={"text-blue-france dark:text-blue-light bg-none"}
    >
      <div
        className={classNames(
          "flex flex-col h-full gap-1 items-center justify-center",
          "border-dashed border border-blue-france dark:border-blue-light rounded-lg p-8",
          "hover:bg-gray-50 dark:hover:bg-grey-dark",
        )}
      >
        <i aria-hidden="true" className={classNames("fr-icon--xl", fr.cx("fr-icon-add-line"))} />
        <span className="text-center text-lg">Évaluer un nouveau projet sur ce site</span>
      </div>
    </a>
  );
}

export default NewProjectTile;
