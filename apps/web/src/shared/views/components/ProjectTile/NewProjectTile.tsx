import { fr } from "@codegouvfr/react-dsfr";

import { routes } from "@/app/router";
import classNames, { ClassValue } from "@/shared/views/clsx";

import ProjectTile from "./ProjectTile";

type Props = {
  siteId: string;
  className?: ClassValue;
};

function NewProjectTile({ siteId, className }: Props) {
  return (
    <ProjectTile
      linkProps={routes.createProject({ siteId }).link}
      variant="dashed"
      className={classNames(
        "justify-center text-blue-france dark:text-blue-light text-lg p-8",
        className,
      )}
    >
      <span aria-hidden="true" className={classNames("fr-icon--xl", fr.cx("fr-icon-add-line"))} />
      Évaluer un nouveau projet sur ce site
    </ProjectTile>
  );
}

export default NewProjectTile;
