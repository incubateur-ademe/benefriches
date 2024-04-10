import { fr } from "@codegouvfr/react-dsfr";
import "@codegouvfr/react-dsfr/dsfr/utility/icons/icons-system/icons-system.css";

import { routes } from "@/app/views/router";

type Props = {
  siteId: string;
};

function NewScenarioTile({ siteId }: Props) {
  return (
    <a
      {...routes.createProjectIntro({ siteId }).link}
      style={{
        width: "100%",
        border: "1px dashed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "260px",
        color: "var(--text-title-blue-france)",
      }}
    >
      <span aria-hidden="true" className={fr.cx("fr-icon--lg", "fr-icon-add-line")}></span>
      Nouveau scénario
    </a>
  );
}

export default NewScenarioTile;
