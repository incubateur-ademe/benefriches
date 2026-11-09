import type { MDXComponents } from "mdx/types";
import { lazy, type LazyExoticComponent } from "react";
import { sumListWithKey, typedObjectEntries, type LetterGrade } from "shared";
import type { Link } from "type-route";

import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";
import { findTotalByName } from "@/features/projects/core/group-impacts/findTotalByName";
import type { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import type { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";

import type { ContentState } from "../../impact-description-modals/ImpactModalDescriptionContext";
import {
  getEnvironmentalImpactColor,
  getSocialImpactColor,
  getSocioEconomicImpactColor,
} from "../../impact-description-modals/colors";
import { getImpactModalData } from "../../impact-description-modals/getImpactData";
import type { ModalHeaderProps } from "../../impact-description-modals/modal-layout/ModalHeader";
import {
  formatCO2Impact,
  formatETPImpact,
  formatMonetaryImpact,
} from "../../shared/formatImpactValue";
import {
  getEnvironmentalImpactLabel,
  getSocialImpactLabel,
  getSocioEconomicImpactLabel,
} from "../../shared/getImpactLabel";
import { LOCAL_AUTHORITY_IMPACTS_CATEGORIES } from "../../shared/impacts/impactGroupCategory";
import {
  describeSoilsQuality,
  describeWaterQuality,
  describeZanCompliance,
} from "../ProjectDevelopmentEnvironmentScore";
import { localPeopleQualityOfLifeDescriptions } from "../ProjectDevelopmentLocalPeopleAndCompanyScore";
import type { DetailsName } from "./useOpenDescriptionModalLink";

const FullTimeJobsMetrics = lazy(() => import("./metrics/FullTimeJobsMetrics"));

const ECOSYSTEM_SERVICES = [
  "newStoredCo2Eq",
  "natureRelatedWelnessAndLeisure",
  "forestRelatedProduct",
  "pollination",
  "invasiveSpeciesRegulation",
  "waterCycle",
  "nitrogenCycle",
  "soilErosion",
] as const;

export const DEVELOPMENT_SCORE_CONFIG_MODALS = {
  global: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/00-intro.mdx"),
    ),
    letterGrade: () => undefined,

    dataProps: () => undefined,
    MetricsComponent: null,
  },

  fullTimeJobsScore: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/02-emplois.mdx"),
    ),
    letterGrade: (d) => d.fullTimeJobsScore.score.letterGrade,
    dataProps: (p) => {
      return getImpactModalData<SocialImpactMetricKeyName>(
        p.modalsData.socialMetricsByCategory.jobs,
        "fullTimeJobs",
        {
          caption: "Détails des emplois temps plein créés, supprimés ou préservés",
          unit: "ETP",
          getLabel: getSocialImpactLabel,
          getColor: getSocialImpactColor,
          getLinkProps: (key) =>
            p.getImpactListModalContentLink({ sectionName: "social.jobs", impactDetailsName: key }),
          formatFn: formatETPImpact,
        },
      );
    },
    MetricsComponent: FullTimeJobsMetrics,
  },

  localPeopleQualityOfLifeScore: {
    dataProps: () => undefined,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/index.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.score.letterGrade,
  },
  "localPeopleQualityOfLifeScore.livingEnvironment": {
    dataProps: () => ({
      type: "value",
      headerProps: {
        subtitle: localPeopleQualityOfLifeDescriptions.livingEnvironment,
      },
    }),
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/cadre-de-vie.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.livingEnvironment.letterGrade,
  },
  "localPeopleQualityOfLifeScore.localHealthiness": {
    dataProps: (d) => ({
      type: "value",
      headerProps: {
        subtitle: localPeopleQualityOfLifeDescriptions.localHealthiness(
          d.developmentScore.details.localPeopleQualityOfLifeScore.indicators,
        ),
      },
    }),
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/sante.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.localHealthiness.letterGrade,
  },
  "localPeopleQualityOfLifeScore.accessToHealthCare": {
    dataProps: (d) => ({
      type: "value",
      headerProps: {
        subtitle: localPeopleQualityOfLifeDescriptions.accessToHealthCare(
          d.developmentScore.details.localPeopleQualityOfLifeScore.indicators,
        ),
      },
    }),
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/acces-aux-soins.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.accessToHealthCare.letterGrade,
  },
  "localPeopleQualityOfLifeScore.accessToLocalServices": {
    dataProps: (d) => ({
      type: "value",
      headerProps: {
        subtitle: localPeopleQualityOfLifeDescriptions.accessToLocalServices(
          d.developmentScore.details.localPeopleQualityOfLifeScore.indicators,
        ),
      },
    }),
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/acces-commerces-services.mdx"),
    ),
    letterGrade: (d) =>
      d.localPeopleQualityOfLifeScore.indicators.accessToLocalServices.letterGrade,
  },
  "localPeopleQualityOfLifeScore.frichesAccidents": {
    dataProps: () => ({
      type: "value",
      headerProps: {
        subtitle: localPeopleQualityOfLifeDescriptions.fricheAccidents,
      },
    }),
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/accidents-friche.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.fricheAccidents.letterGrade,
  },
  "localPeopleQualityOfLifeScore.trafficSecurity": {
    dataProps: () => ({
      type: "value",
      headerProps: {
        subtitle: localPeopleQualityOfLifeDescriptions.trafficSecurity,
      },
    }),
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
    dataProps: (p) => {
      const impacts = p.modalsData.economicImpactsByBearerAndCategory.localAuthority.impacts;

      const data = typedObjectEntries(
        Object.groupBy(impacts, (item) => {
          switch (item.keyName) {
            case "oldRentalIncomeLoss":
            case "projectedRentalIncome":
              return "rentalIncome";

            case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
            case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
              return "fricheCosts";

            case "previousSiteOperationBenefitLoss":
            case "projectOperatingExpenses":
            case "projectOperatingRevenues":
              return "operatingEconomicBalance";

            case "propertyTransferDutiesIncome":
            case "localTransferDutiesIncrease":
            case "taxesIncome":
              return "taxesIncome";

            case "waterRegulation":
            case "fricheRoadsAndUtilitiesExpenses":
              return "municipalityExpenses";
            default:
              return "other";
          }
        }),
      ).map(([category, items = []]) => ({
        label: category === "other" ? "Autres" : LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].label,
        total: sumListWithKey(items, "total"),
        values: items.map(({ keyName, total }) => ({
          name: keyName,
          value: total,
          label: getSocioEconomicImpactLabel(keyName),
          color: getSocioEconomicImpactColor(keyName),
          linkProps: p.getImpactListModalContentLink({
            sectionName: "socioEconomic.localAuthority" as const,
            impactDetailsName: keyName,
          }),
        })),
      }));
      return {
        type: "groupedColumn",
        total: p.modalsData.economicImpactsByBearerAndCategory.localAuthority.total,
        headerProps: {
          value: {
            text: formatMonetaryImpact(
              p.modalsData.economicImpactsByBearerAndCategory.localAuthority.total,
            ),
            state:
              p.modalsData.economicImpactsByBearerAndCategory.localAuthority.total > 0
                ? "success"
                : "error",
          },
        },
        chartProps: {
          format: "monetary",
          exportTitle: "Impacts socio-économiques pour la collectivité",
          data: data,
        },
        tableProps: {
          formatFn: formatCO2Impact,
          caption: "Liste des impacts socio-économiques pour la collectivité",
          data: data,
        },
      };
    },
  },

  environmentScore: {
    dataProps: () => undefined,
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
    dataProps: (p) => {
      return getImpactModalData<EnvironmentalImpactMetricKeyName>(
        p.modalsData.environmentalMetricsByCategory.co2eq,
        "avoidedCo2eqEmissions",
        {
          caption: "Liste des émissions de Co2eq évitées",
          getLabel: getEnvironmentalImpactLabel,
          getColor: getEnvironmentalImpactColor,
          getLinkProps: (key) =>
            p.getImpactListModalContentLink({
              sectionName: "environmental.co2eq",
              impactDetailsName: key,
            }),
          formatFn: formatCO2Impact,
        },
      );
    },
  },
  "environmentScore.ecosystemServices": {
    dataProps: (p) => {
      const { metrics } = p.developmentScore.details.environmentScore.indicators.ecosystemServices;

      const details = ECOSYSTEM_SERVICES.map((name) => ({
        label: getSocioEconomicImpactLabel(`ecosystemServices.${name}`),
        value: findTotalByName(metrics.ecosystemicServices, name),
        color: getSocioEconomicImpactColor(`ecosystemServices.${name}`),
        linkProps: p.getImpactListModalContentLink({
          sectionName: "socioEconomic.humanity",
          impactDetailsName: `ecosystemServices.${name}`,
        }),
      })).toSorted((a, b) => b.value - a.value);

      const total = sumListWithKey(details, "value");

      return {
        type: "column",
        total: sumListWithKey(details, "value"),
        headerProps: {
          value: {
            text: formatMonetaryImpact(total),
            state: total > 0 ? "success" : "error",
          },
        },
        chartProps: {
          format: "monetary",
          data: details,
          exportTitle: getSocioEconomicImpactLabel("ecosystemServices"),
        },
        tableProps: {
          formatFn: formatMonetaryImpact,
          caption:
            "Liste des impacts écosystémiques pouvant être rendus par les sols et leur valeur pour le projet",
          data: details,
        },
      };
    },
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/services-ecosystemiques.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.ecosystemServices.letterGrade,
    MetricsComponent: null,
  },
  "environmentScore.soilsQuality": {
    dataProps: (d) => ({
      type: "value",
      headerProps: {
        subtitle: describeSoilsQuality(
          d.developmentScore.details.environmentScore.indicators.soilsQuality,
        ),
      },
    }),
    MetricsComponent: null,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/qualite-des-sols.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.soilsQuality.letterGrade,
  },
  "environmentScore.waterQuality": {
    dataProps: (d) => ({
      type: "value",
      headerProps: {
        subtitle: describeWaterQuality(
          d.developmentScore.details.environmentScore.indicators.waterQuality,
        ),
      },
    }),
    MetricsComponent: null,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/qualite-de-l-eau.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.waterQuality.letterGrade,
  },
  "environmentScore.zanCompliance": {
    dataProps: (d) => ({
      type: "value",
      headerProps: {
        subtitle: describeZanCompliance(
          d.developmentScore.details.environmentScore.indicators.zanCompliance,
        ),
      },
    }),
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
    ContentComponent: ContentComponent;
    letterGrade: (details: LetterGradeInput) => LetterGrade | undefined;
    MetricsComponent: React.ComponentType<
      Pick<DevelopmentScoreDataView, "developmentScore">
    > | null;

    dataProps: (p: DataPropsInput) => ModalHeaderProps["dataProps"];
  }
>;

type DataPropsInput = DevelopmentScoreDataView & {
  getUpdateDetailsLink: (details?: string) => Link;
  getImpactListModalContentLink: (args: ContentState) => Link | undefined;
};

type LetterGradeInput = DevelopmentScoreDataView["developmentScore"]["details"];

export type ContentComponent = LazyExoticComponent<ContentComponentType>;

type ContentComponentType = React.ComponentType<{
  components?: MDXComponents;
}>;
