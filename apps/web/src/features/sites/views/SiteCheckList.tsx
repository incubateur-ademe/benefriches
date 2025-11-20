import Button from "@codegouvfr/react-dsfr/Button";
import { Route } from "type-route";

import classNames from "@/shared/views/clsx";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import { routes, useRoute } from "@/shared/views/router";

type TaskStatus = "completed" | "skipped" | "todo";

const statusIconClasses = {
  completed: "bg-success-ultralight border-success-light text-success-dark",
  skipped: "bg-success-ultralight border-success-light text-success-dark",
  todo: "border-text-medium bg-background-light",
} as const;

function StatusIndicator({ status }: { status: TaskStatus }) {
  return (
    <i
      className={classNames(
        "h-14 w-14 rounded-full flex items-center justify-center",
        statusIconClasses[status],
        status === "completed" && "fr-icon-check-line",
        status === "skipped" && "fr-icon-close-line",
      )}
    />
  );
}

function TaskItem({
  name,
  status,
  children,
}: {
  name: string;
  status: TaskStatus;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex items-center justify-between m-0 py-4 border-b border-border-grey">
      <div className="flex items-center gap-4">
        <StatusIndicator status={status} />
        <h4 className="mb-0 font-normal text-lg">{name}</h4>
      </div>
      {children}
    </li>
  );
}

export default function SiteCheckList({ siteId, siteName }: { siteId: string; siteName: string }) {
  const route = useRoute() as Route<typeof routes.siteFeatures>;
  return (
    <section>
      <ul className="list-none p-0 space-y-8 text-lg">
        <TaskItem name="Renseignement de mon site" status="completed" />
        <TaskItem name="Analyse de la compatibilité de la friche" status="completed" />
        <TaskItem
          name="Évaluation des impacts socio-économiques d'un projet d'aménagement"
          status="todo"
        >
          <Button
            size="small"
            linkProps={routes.projectCreationOnboarding({
              siteId,
              siteName,
              projectSuggestions: route.params.projectEvaluationSuggestions,
            })}
          >
            Choisir un projet à évaluer
          </Button>
        </TaskItem>
        <TaskItem name="Demande d'accompagnement par un·e expert·e friche" status="todo">
          <ExternalLink className="text-sm" href="https://urbanvitaliz.fr/">
            Contacter un conseiller Urban Vitaliz
          </ExternalLink>
        </TaskItem>
        <TaskItem name="Demande de conseils sur la dépollution" status="todo">
          <ExternalLink className="text-sm" href="mailto:friches.fondsvert@ademe.fr">
            Contacter l'ADEME
          </ExternalLink>
        </TaskItem>
        <TaskItem name="Trouver des subventions" status="todo">
          <ExternalLink className="text-sm" href="https://aides-territoires.beta.gouv.fr/">
            Vérifier mon éligibilité sur Aides-Territoires
          </ExternalLink>
        </TaskItem>
      </ul>
    </section>
  );
}
