import "@codegouvfr/react-dsfr/dsfr/utility/icons/icons-system/icons-system.css";

import { routes } from "@/app/application/router";

type Props = {
  siteId: string;
};

function NewProjectButton({ siteId }: Props) {
  return (
    <a {...routes.createProjectIntro({ siteId }).link}>
      <div
        style={{
          border: "2px #ddd dashed",
          minHeight: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button>
          <strong>Créer un projet alternatif</strong>
        </button>
      </div>
    </a>
  );
}

export default NewProjectButton;
