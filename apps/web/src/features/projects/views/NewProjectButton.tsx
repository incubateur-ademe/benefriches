import { fr } from "@codegouvfr/react-dsfr/fr";
import "@codegouvfr/react-dsfr/dsfr/utility/icons/icons-system/icons-system.css";

import { routes } from "@/router";

type Props = {
  siteId: string;
};

function NewProjectButton({ siteId }: Props) {
  return (
    <a {...routes.createProjectIntro({ siteId }).link}>
      <div
        style={{
          border: "2px gray dashed",
          borderRadius: "9px",
          minHeight: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={fr.cx("fr-icon-add-line", "fr-icon--lg")} />
      </div>
    </a>
  );
}

export default NewProjectButton;
