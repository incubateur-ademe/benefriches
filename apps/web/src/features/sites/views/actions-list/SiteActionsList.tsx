import Button from "@codegouvfr/react-dsfr/Button";
import { SiteActionStatus, SiteActionType, SiteNature } from "shared";
import { Route } from "type-route";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import { routes, useRoute } from "@/shared/views/router";

import { ActionItem } from "./ActionItem";

type ActionsList = { action: SiteActionType; status: SiteActionStatus }[];

type ActionConfig = {
  label: string;
  position: number;
  renderAction: (props: {
    status: SiteActionStatus;
    siteId: string;
    siteName: string;
    routeParams: Route<typeof routes.siteFeatures>["params"];
  }) => React.ReactNode;
};

const ACTIONS_CONFIG = {
  EVALUATE_COMPATIBILITY: {
    label: "Analyse de la compatibilité de la friche",
    position: 0,
    renderAction: ({ siteId, status, routeParams }) =>
      status === "done" ? (
        <a
          className="text-sm text-blue-france"
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
    label: "Évaluation des impacts socio-économiques d'un projet d'aménagement",
    position: 1,
    renderAction: ({ status, siteId, siteName, routeParams }) =>
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
    label: "Demande d'accompagnement par un·e expert·e friche",
    position: 2,
    renderAction: () => (
      <ExternalLink className="text-sm text-blue-france" href="https://urbanvitaliz.fr/">
        Contacter un conseiller Urban Vitaliz
      </ExternalLink>
    ),
  },
  REQUEST_INFORMATION_ABOUT_REMEDIATION: {
    label: "Demande de conseils sur la dépollution",
    position: 3,
    renderAction: () => (
      <ExternalLink className="text-sm text-blue-france" href="mailto:friches.fondsvert@ademe.fr">
        Contacter l'ADEME
      </ExternalLink>
    ),
  },
  REQUEST_FUNDING_INFORMATION: {
    label: "Demande d'information sur les financements",
    position: 4,
    renderAction: () => (
      <ExternalLink
        className="text-sm text-blue-france"
        href="https://aides-territoires.beta.gouv.fr/"
      >
        Vérifier mon éligibilité sur Aides-Territoires
      </ExternalLink>
    ),
  },
  REFERENCE_SITE_ON_CARTOFRICHES: {
    label: "Référencer le site sur Cartofriches",
    position: 5,
    renderAction: () => null,
  },
} as const satisfies Record<SiteActionType, ActionConfig>;

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
        <ActionItem name="Renseignement de mon site" status="done">
          <a
            className="text-sm text-blue-france"
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
            <ActionItem key={action.action} name={config.label} status={action.status}>
              {config.renderAction({
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
