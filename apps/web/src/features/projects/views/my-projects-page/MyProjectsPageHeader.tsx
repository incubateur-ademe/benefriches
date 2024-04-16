import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";

function MyProjectsPageHeader() {
  return (
    <div className={classNames(fr.cx("fr-grid-row"), "tw-justify-between", "tw-items-center")}>
      <h2>Mes projets</h2>
      <div>
        <Button
          priority="primary"
          linkProps={routes.createSiteFoncierIntro().link}
          iconId="fr-icon-add-line"
        >
          Nouveau site
        </Button>
      </div>
    </div>
  );
}

export default MyProjectsPageHeader;
