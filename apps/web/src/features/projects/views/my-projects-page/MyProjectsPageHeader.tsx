import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/application/router";

function MyProjectsPageHeader() {
  return (
    <div
      className={fr.cx("fr-grid-row")}
      style={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <h2>Mes projets</h2>
      <div>
        <Button priority="primary" linkProps={routes.createSiteFoncierIntro().link}>
          Nouveau site
        </Button>
      </div>
    </div>
  );
}

export default MyProjectsPageHeader;
