import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { routes } from "@/app/application/router";

type Props = {
  projectName: string;
  projectId: string;
  siteName: string;
};

const ProjectsImpactsPageHeader = ({ projectName, projectId, siteName }: Props) => {
  return (
    <>
      <div className={fr.cx("fr-grid-row")} style={{ justifyContent: "space-between" }}>
        <h2>{projectName}</h2>
        <ButtonsGroup
          inlineLayoutWhen="always"
          buttons={[
            {
              priority: "secondary",
              disabled: true,
              children: "Modifier le site",
            },
            {
              priority: "secondary",
              disabled: true,
              children: "Modifier le projet",
            },
            {
              priority: "secondary",
              children: "Comparer les impacts",
              linkProps: routes.selectProjectToCompare({
                baseProjectId: projectId,
              }).link,
            },
            { priority: "secondary", disabled: true, children: "Exporter" },
          ]}
        />
      </div>
      <h3>{siteName}</h3>
    </>
  );
};

export default ProjectsImpactsPageHeader;
