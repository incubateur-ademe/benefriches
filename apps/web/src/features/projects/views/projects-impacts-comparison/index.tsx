import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import CallOut from "@codegouvfr/react-dsfr/CallOut";
import { Route } from "type-route";

import { routes } from "@/app/views/router";

type Props = {
  route: Route<typeof routes.compareProjects>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ProjectsImpactsComparison(_: Props) {
  return (
    <div className={fr.cx("fr-container", "fr-py-5v")}>
      <h1>Comparaison de scénarios</h1>
      <CallOut title="En construction">
        Désolé, cette page est toujours en construction. Les données ne sont donc pas accessibles
        pour l'instant. Nous travaillons activement pour vous donner de la visibilité le plus
        rapidement possible.
      </CallOut>

      <Button priority="primary" {...routes.myProjects().link}>
        Retour à mes projets
      </Button>
    </div>
  );
}

export default ProjectsImpactsComparison;
