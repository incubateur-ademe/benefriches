import {
  capitalize,
  convertSquareMetersToHectares,
  getFricheActivityLabel,
  getLabelForAgriculturalOperationActivity,
  getLabelForNaturalAreaType,
  SiteImpactsDataView,
} from "shared";

import { ProjectImpactsState } from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import { SiteFeatures } from "@/features/sites/core/site.types";
import SiteFeaturesList from "@/features/sites/views/features/SiteFeaturesList";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import DsfrDialogTitle from "@/shared/views/components/Dialog/DsfrDialogTitle";

import EmojiListItem from "../../../shared/emoji-li-item/StepEmojiListItem";
import IntroModalAccordion from "./IntroModalAccordion";

const formatSiteDataAsFeatures = (siteData: SiteImpactsDataView): SiteFeatures => {
  const base = {
    id: siteData.id,
    name: siteData.name,
    isExpressSite: siteData.isExpressSite,
    address: siteData.address.value,
    ownerName: siteData.ownerName,
    tenantName: siteData.tenantName,
    surfaceArea: siteData.surfaceArea,
    soilsDistribution: siteData.soilsDistribution,
    expenses: siteData.yearlyExpenses,
    incomes: siteData.yearlyIncomes,
    description: siteData.description,
  };

  switch (siteData.nature) {
    case "FRICHE":
      return {
        ...base,
        nature: "FRICHE",
        fricheActivity: siteData.fricheActivity,
        contaminatedSurfaceArea: siteData.contaminatedSoilSurface,
        accidents: {
          minorInjuries: siteData.accidentsMinorInjuries || 0,
          severeInjuries: siteData.accidentsSevereInjuries || 0,
          accidentsDeaths: siteData.accidentsDeaths || 0,
        },
      };
    case "AGRICULTURAL_OPERATION":
      return {
        ...base,
        nature: "AGRICULTURAL_OPERATION",
        agriculturalOperationActivity: siteData.agriculturalOperationActivity!,
      };
    case "NATURAL_AREA":
      return {
        ...base,
        nature: "NATURAL_AREA",
        naturalAreaType: siteData.naturalAreaType!,
      };
    case "URBAN_ZONE":
      return {
        ...base,
        nature: "URBAN_ZONE",
        contaminatedSurfaceArea: siteData.contaminatedSoilSurface,
      };
  }
};

type Props = {
  contextData: Exclude<ProjectImpactsState["contextData"], undefined>;
  comparisonSiteData: SiteImpactsDataView;
};

const STYLES_BY_SITE_NATURE = {
  background: {
    AGRICULTURAL_OPERATION: "bg-[#F1EAD0]",
    FRICHE: "bg-[#E4D7E5]",
    NATURAL_AREA: "bg-[#D9E7DA]",
    URBAN_ZONE: "bg-[#E0E4F5]",
  },
} as const;

const formatCityWithPlacePreposition = (name: string): string => {
  const nameLowerCase = name.toLocaleLowerCase();
  if (nameLowerCase.startsWith("les ")) {
    return `aux ${capitalize(name.substring(4))}`;
  }
  if (nameLowerCase.startsWith("le ")) {
    return `au ${capitalize(name.substring(3))}`;
  }
  return `à ${capitalize(name)}`;
};

export default function IntroModalFirstStepContent({ contextData, comparisonSiteData }: Props) {
  const emojiClassName = {
    root: "flex gap-2",
    emoji: STYLES_BY_SITE_NATURE.background[comparisonSiteData.nature],
  };

  return (
    <>
      <DsfrDialogTitle>
        Bénéfriches va créer{" "}
        <span className={STYLES_BY_SITE_NATURE.background[comparisonSiteData.nature]}>
          {(() => {
            switch (comparisonSiteData.nature) {
              case "AGRICULTURAL_OPERATION":
                return "une exploitation agricole fictive";
              case "FRICHE":
                return "une friche fictive";
              case "NATURAL_AREA":
                return "un espace naturel fictif";
              case "URBAN_ZONE":
                return "une zone urbaine fictive";
            }
          })()}
        </span>
        &nbsp;:
      </DsfrDialogTitle>
      <ul className="mb-6 mt-2 pl-18 space-y-2">
        {(() => {
          switch (comparisonSiteData.nature) {
            case "AGRICULTURAL_OPERATION":
              return (
                <EmojiListItem emoji="🐄" size="large" classes={emojiClassName}>
                  <span className="flex flex-col">
                    <strong>
                      Exploitation de type «&nbsp;
                      {getLabelForAgriculturalOperationActivity(
                        comparisonSiteData.agriculturalOperationActivity ??
                          "POLYCULTURE_AND_LIVESTOCK",
                      )}
                      &nbsp;»
                    </strong>
                    Type d'exploitation le plus présent en France
                  </span>
                </EmojiListItem>
              );

            case "FRICHE":
              return (
                <EmojiListItem emoji="🏚️" size="large" classes={emojiClassName}>
                  <span className="flex flex-col">
                    <strong>
                      Friche de type «&nbsp;
                      {getFricheActivityLabel(comparisonSiteData.fricheActivity ?? "INDUSTRY")}
                      &nbsp;»
                    </strong>
                    Type de friche le plus présent en France
                  </span>
                </EmojiListItem>
              );
            case "NATURAL_AREA":
              return (
                <EmojiListItem emoji="🐝" size="large" classes={emojiClassName}>
                  <span className="flex flex-col">
                    <strong>
                      Espace naturel de type «&nbsp;
                      {getLabelForNaturalAreaType(comparisonSiteData.naturalAreaType ?? "PRAIRIE")}
                      &nbsp;»
                    </strong>
                    Type d'espace naturel le plus présent en France
                  </span>
                </EmojiListItem>
              );
            case "URBAN_ZONE":
              return (
                <EmojiListItem emoji="🏙️" size="large" classes={emojiClassName}>
                  <span className="flex flex-col">
                    <strong>Zone d'activités économiques</strong>
                  </span>
                </EmojiListItem>
              );
          }
        })()}

        <EmojiListItem emoji="📍" size="large" classes={emojiClassName}>
          <span className="flex flex-col">
            <strong>
              Implanté {formatCityWithPlacePreposition(contextData.siteAddress.label)}
            </strong>
            <span>
              {(() => {
                switch (contextData.siteNature) {
                  case "AGRICULTURAL_OPERATION":
                    return "Même commune que l'exploitation agricole";
                  case "FRICHE":
                    return "Même commune que la friche";
                  case "NATURAL_AREA":
                    return "Même commune que l'espace naturel";
                  case "URBAN_ZONE":
                    return "Même commune que la zone urbaine";
                }
              })()}
            </span>
          </span>
        </EmojiListItem>
        <EmojiListItem emoji="📏" size="large" classes={emojiClassName}>
          <span className="flex flex-col">
            <strong>
              {formatNumberFr(convertSquareMetersToHectares(contextData.siteSurfaceArea))} ha de
              superficie
            </strong>

            <span>
              {(() => {
                switch (contextData.siteNature) {
                  case "AGRICULTURAL_OPERATION":
                    return "Même superficie que l'exploitation agricole";
                  case "FRICHE":
                    return "Même superficie que la friche";
                  case "NATURAL_AREA":
                    return "Même superficie que l'espace naturel";
                  case "URBAN_ZONE":
                    return "Même superficie que la zone urbaine";
                }
              })()}
            </span>
          </span>
        </EmojiListItem>
      </ul>
      <p>
        Vous allez ainsi comparer les impacts de votre projet{" "}
        <strong>«&nbsp;{contextData.projectName}&nbsp;»</strong> sur le site «&nbsp;
        {contextData.relatedSiteName}&nbsp;» avec le même projet sur{" "}
        {(() => {
          switch (comparisonSiteData.nature) {
            case "AGRICULTURAL_OPERATION":
              return "cette exploitation agricole";
            case "FRICHE":
              return "cette friche";
            case "NATURAL_AREA":
              return "cet espace naturel";
            case "URBAN_ZONE":
              return "cette zone urbaine";
          }
        })()}
        .
      </p>

      <IntroModalAccordion
        title={(() => {
          switch (comparisonSiteData.nature) {
            case "AGRICULTURAL_OPERATION":
              return "Caractéristiques détaillées de l’exploitation agricole";
            case "FRICHE":
              return "Caractéristiques détaillées de la friche";
            case "NATURAL_AREA":
              return "Caractéristiques détaillées de l’espace naturel";
            case "URBAN_ZONE":
              return "Caractéristiques détaillées de la zone urbaine";
          }
        })()}
      >
        <SiteFeaturesList
          withExpressDisclaimer={false}
          siteFeatures={formatSiteDataAsFeatures(comparisonSiteData)}
        />
      </IntroModalAccordion>
    </>
  );
}
