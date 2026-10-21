import type { MDXComponents } from "mdx/types";
import { lazy, type LazyExoticComponent } from "react";
import type { LetterGrade } from "shared";
import type { Link } from "type-route";

import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";

import type { DetailsName } from "./useOpenDescriptionModalLink";

const FullTimeJobsMetrics = lazy(() => import("./metrics/FullTimeJobsMetrics"));

const EcosystemServicesData = lazy(() => import("./data/EcosystemServicesData"));
const Co2eqEmissionsVariationData = lazy(() => import("./data/Co2eqEmissionsVariationData"));
const LocalAuthorityFinancesData = lazy(() => import("./data/LocalAuthorityFinancesData"));
const FullTimeJobsData = lazy(() => import("./data/FullTimeJobsData"));

export const DEVELOPMENT_SCORE_CONFIG_MODALS = {
  global: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/00-intro.mdx"),
    ),
    letterGrade: () => undefined,
    DataComponent: null,
    MetricsComponent: null,
  },

  fullTimeJobsScore: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/02-emplois.mdx"),
    ),
    letterGrade: (d) => d.fullTimeJobsScore.score.letterGrade,
    DataComponent: FullTimeJobsData,
    MetricsComponent: FullTimeJobsMetrics,
  },

  localPeopleQualityOfLifeScore: {
    DataComponent: null,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/index.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.score.letterGrade,
  },
  "localPeopleQualityOfLifeScore.livingEnvironment": {
    DataComponent: null,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/cadre-de-vie.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.livingEnvironment.letterGrade,
  },
  "localPeopleQualityOfLifeScore.localHealthiness": {
    DataComponent: null,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/sante.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.localHealthiness.letterGrade,
  },
  "localPeopleQualityOfLifeScore.accessToHealthCare": {
    DataComponent: null,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/acces-aux-soins.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.accessToHealthCare.letterGrade,
  },
  "localPeopleQualityOfLifeScore.accessToLocalServices": {
    DataComponent: null,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/acces-commerces-services.mdx"),
    ),
    letterGrade: (d) =>
      d.localPeopleQualityOfLifeScore.indicators.accessToLocalServices.letterGrade,
  },
  "localPeopleQualityOfLifeScore.frichesAccidents": {
    DataComponent: null,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/accidents-friche.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.fricheAccidents.letterGrade,
  },
  "localPeopleQualityOfLifeScore.trafficSecurity": {
    DataComponent: null,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/securite-routiere.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.trafficSecurity.letterGrade,
  },

  localAuthorityEconomicScore: {
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/01-finances-collectivite.mdx"),
    ),
    letterGrade: (d) => d.localAuthorityEconomicScore.score.letterGrade,
    DataComponent: LocalAuthorityFinancesData,
  },

  environmentScore: {
    DataComponent: null,
    MetricsComponent: null,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/index.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.score.letterGrade,
  },
  "environmentScore.co2eqEmissionsVariation": {
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/co2eq.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.co2eqEmissionsVariation.letterGrade,
    DataComponent: Co2eqEmissionsVariationData,
  },
  "environmentScore.ecosystemServices": {
    DataComponent: EcosystemServicesData,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/services-ecosystemiques.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.ecosystemServices.letterGrade,
    MetricsComponent: null,
  },
  "environmentScore.soilsQuality": {
    DataComponent: null,
    MetricsComponent: null,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/qualite-des-sols.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.soilsQuality.letterGrade,
  },
  "environmentScore.waterQuality": {
    DataComponent: null,
    MetricsComponent: null,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/qualite-de-l-eau.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.waterQuality.letterGrade,
  },
  "environmentScore.zanCompliance": {
    DataComponent: null,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/zan.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.zanCompliance.letterGrade,
  },
} as const satisfies Record<
  DetailsName,
  {
    ContentComponent: LazyExoticComponent<ContentComponentType>;
    letterGrade: (
      details: DevelopmentScoreDataView["developmentScore"]["details"],
    ) => LetterGrade | undefined;
    DataComponent: React.ComponentType<DataProps> | null;
    MetricsComponent: React.ComponentType<
      Pick<DevelopmentScoreDataView, "developmentScore">
    > | null;
  }
>;

type ContentComponentType = React.ComponentType<{
  components?: MDXComponents;
}>;

export type DataProps = DevelopmentScoreDataView & {
  getUpdateDetailsLink: (details?: string) => Link;
};
