import Button from "@codegouvfr/react-dsfr/Button";
import { SiteActionStatus, SiteActionType, SiteNature } from "shared";
import { Route } from "type-route";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import { routes, useRoute } from "@/shared/views/router";

import { ActionItem } from "./ActionItem";

type ActionsList = { action: SiteActionType; status: SiteActionStatus }[];

type ActionConfig = {
  title: string;
  position: number;
  collapsable: boolean;
  renderChildren: (props: {
    status: SiteActionStatus;
    siteId: string;
    siteName: string;
    routeParams: Route<typeof routes.siteFeatures>["params"];
  }) => React.ReactNode;
};

const ACTIONS_CONFIG: Record<SiteActionType, ActionConfig> = {
  EVALUATE_COMPATIBILITY: {
    title: "Analyse de la compatibilité de la friche",
    position: 0,
    collapsable: false,
    renderChildren: ({ siteId, status, routeParams }) =>
      status === "done" ? (
        <a
          className="text-sm text-blue-france dark:text-blue-light"
          {...routes.siteCompatibilityEvaluation({
            siteId,
            fromCompatibilityEvaluation: routeParams.fromCompatibilityEvaluation,
            projectEvaluationSuggestions: routeParams.projectEvaluationSuggestions,
          }).link}
        >
          Voir l'analyse de compatibilité
        </a>
      ) : null,
  },
  EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS: {
    title: "Évaluation des impacts socio-économiques d'un projet d'aménagement",
    position: 1,
    collapsable: false,
    renderChildren: ({ status, siteId, siteName, routeParams }) =>
      status === "todo" ? (
        <Button
          size="small"
          linkProps={
            routes.projectCreationOnboarding({
              siteId,
              siteName,
              projectSuggestions: routeParams.projectEvaluationSuggestions,
            }).link
          }
        >
          Choisir un projet à évaluer
        </Button>
      ) : null,
  },
  REQUEST_URBAN_VITALIZ_SUPPORT: {
    title: "Demande d'accompagnement par un·e expert·e friche",
    collapsable: true,
    position: 2,
    renderChildren: () => (
      <div className="flex items-center justify-between">
        <p className="m-0">
          Soyez accompagné de A à Z dans votre projet de reconversion de friche par un conseiller
          UrbanVitaliz.
        </p>
        <ExternalLink
          className="text-sm text-blue-france dark:text-blue-light"
          href="https://urbanvitaliz.fr/"
        >
          Contacter un conseiller Urban Vitaliz
        </ExternalLink>
      </div>
    ),
  },
  REQUEST_INFORMATION_ABOUT_REMEDIATION: {
    title: "Demande de conseils sur la dépollution",
    collapsable: false,
    position: 3,
    renderChildren: () => (
      <ExternalLink
        className="text-sm text-blue-france dark:text-blue-light"
        href="mailto:friches.fondsvert@ademe.fr"
      >
        Contacter l'ADEME
      </ExternalLink>
    ),
  },
  REQUEST_FUNDING_INFORMATION: {
    title: "Demande de subventions",
    position: 4,
    collapsable: true,
    renderChildren: () => (
      <div className="flex items-center justify-between">
        <p className="m-0">
          Vérifiez l'éligibilité de votre friche aux subventions sur Aide-Territoires.
        </p>
        <ExternalLink
          className="text-sm text-blue-france dark:text-blue-light"
          href="https://aides-territoires.beta.gouv.fr/"
        >
          Vérifier mon éligibilité
        </ExternalLink>
      </div>
    ),
  },
  REFERENCE_SITE_ON_CARTOFRICHES: {
    title: "Mise en avant de ma friche",
    collapsable: true,
    position: 5,
    renderChildren: () => (
      <div className="flex items-center justify-between">
        <p className="m-0">
          Rendez visible votre friche auprès de porteurs de projets en la recensant sur
          Cartofriches.
        </p>
        <ExternalLink
          href="https://cartofriches.cerema.fr/cartofriches/"
          className="text-sm text-blue-france dark:text-blue-light"
        >
          Référencer ma friche
        </ExternalLink>
      </div>
    ),
  },
};

const sortActionsByOrder = (actions: ActionsList): ActionsList => {
  return actions.toSorted(
    (a, b) => ACTIONS_CONFIG[a.action].position - ACTIONS_CONFIG[b.action].position,
  );
};

type Props = {
  siteId: string;
  siteName: string;
  siteNature: SiteNature;
  actions: ActionsList;
};

export default function SiteActionsList({ siteId, siteName, siteNature, actions }: Props) {
  const route = useRoute() as Route<typeof routes.siteFeatures>;
  return (
    <section>
      <h3 className="text-2xl">Suivi du site</h3>
      <ul className="list-none p-0 space-y-8 text-lg">
        <ActionItem title="Renseignement de mon site" status="done" display="inline">
          <a
            className="text-sm text-blue-france dark:text-blue-light"
            {...routes.siteCompatibilityEvaluation({
              siteId,
              fromCompatibilityEvaluation: route.params.fromCompatibilityEvaluation,
              projectEvaluationSuggestions: route.params.projectEvaluationSuggestions,
            }).link}
          >
            Voir les caractéristiques de {siteNature === "FRICHE" ? "ma friche" : "mon site"}
          </a>
        </ActionItem>
        {sortActionsByOrder(actions).map((action) => {
          const config = ACTIONS_CONFIG[action.action];
          return (
            <ActionItem
              key={action.action}
              title={config.title}
              status={action.status}
              collapsable={config.collapsable}
            >
              {config.renderChildren({
                status: action.status,
                siteId,
                siteName,
                routeParams: route.params,
              })}
            </ActionItem>
          );
        })}
      </ul>
    </section>
  );
}
