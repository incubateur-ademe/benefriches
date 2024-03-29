import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { routes } from "@/app/views/router";

type Props = {
  projectName: string;
  projectId: string;
  siteName: string;
};

const ProjectsImpactsPageHeader = ({ projectName, projectId, siteName }: Props) => {
  return (
    <section>
      <div className={fr.cx("fr-grid-row")} style={{ justifyContent: "space-between" }}>
        <h2>{projectName}</h2>
        <ButtonsGroup
          inlineLayoutWhen="always"
          buttons={[
            {
              priority: "secondary",
              children: "Comparer les impacts",
              linkProps: routes.selectProjectToCompare({
                baseProjectId: projectId,
              }).link,
            },
          ]}
        />
      </div>
      <h3>{siteName}</h3>
    </section>
  );
};

export default ProjectsImpactsPageHeader;
