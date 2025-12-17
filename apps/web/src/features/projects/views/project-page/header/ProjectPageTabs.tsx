import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";
import TabItem from "@/shared/views/components/TabItem/TabItem";
import { routes, useRoute } from "@/shared/views/router";

import { ProjectRoute } from "../ProjectPage";

const ProjectPageTabs = () => {
  const route = useRoute() as ProjectRoute;

  return (
    <div className={classNames(fr.cx("fr-container"))}>
      <ul role="navigation" className="list-none inline-flex gap-2 m-0 p-0">
        <TabItem
          isActive={route.name === routes.projectImpacts.name}
          iconId="fr-icon-bar-chart-box-line"
          label="Évaluation des impacts"
          linkProps={routes.projectImpacts(route.params).link}
        />
        <TabItem
          isActive={route.name === routes.projectFeatures.name}
          iconId="fr-icon-article-line"
          label="Caractéristiques du projet"
          linkProps={routes.projectFeatures(route.params).link}
        />
      </ul>
    </div>
  );
};

export default ProjectPageTabs;
