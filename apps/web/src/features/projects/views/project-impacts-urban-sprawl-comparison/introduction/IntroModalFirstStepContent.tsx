import {
  capitalize,
  convertSquareMetersToHectares,
  getFricheActivityLabel,
  getLabelForAgriculturalOperationActivity,
  getLabelForNaturalAreaType,
} from "shared";

import { UrbanSprawlImpactsComparisonState } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import SiteFeaturesList from "@/features/sites/views/features/SiteFeaturesList";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import DsfrDialogTitle from "@/shared/views/components/Dialog/DsfrDialogTitle";

import EmojiListItem from "../../shared/emoji-li-item/StepEmojiListItem";
import { formatSiteDataAsFeatures } from "../formatSiteData";
import IntroModalAccordion from "./IntroModalAccordion";

type Props = {
  projectName: string;
  baseSiteData: Exclude<
    UrbanSprawlImpactsComparisonState["baseCase"],
    undefined
  >["conversionSiteData"];
  comparisonSiteData: Exclude<
    UrbanSprawlImpactsComparisonState["baseCase"],
    undefined
  >["conversionSiteData"];
};

const STYLES_BY_SITE_NATURE = {
  background: {
    AGRICULTURAL_OPERATION: "bg-[#F1EAD0]",
    FRICHE: "bg-[#E4D7E5]",
    NATURAL_AREA: "bg-[#D9E7DA]",
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

export default function IntroModalFirstStepContent({
  projectName,
  baseSiteData,
  comparisonSiteData,
}: Props) {
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
          }
        })()}

        <EmojiListItem emoji="📍" size="large" classes={emojiClassName}>
          <span className="flex flex-col">
            <strong>Implanté {formatCityWithPlacePreposition(baseSiteData.address.city)}</strong>
            <span>
              {(() => {
                switch (baseSiteData.nature) {
                  case "AGRICULTURAL_OPERATION":
                    return "Même commune que l'exploitation agricole";
                  case "FRICHE":
                    return "Même commune que la friche";
                  case "NATURAL_AREA":
                    return "Même commune que l'espace naturel";
                }
              })()}
            </span>
          </span>
        </EmojiListItem>
        <EmojiListItem emoji="📏" size="large" classes={emojiClassName}>
          <span className="flex flex-col">
            <strong>
              {formatNumberFr(convertSquareMetersToHectares(baseSiteData.surfaceArea))} ha de
              superficie
            </strong>

            <span>
              {(() => {
                switch (baseSiteData.nature) {
                  case "AGRICULTURAL_OPERATION":
                    return "Même superficie que l'exploitation agricole";
                  case "FRICHE":
                    return "Même superficie que la friche";
                  case "NATURAL_AREA":
                    return "Même superficie que l'espace naturel";
                }
              })()}
            </span>
          </span>
        </EmojiListItem>
      </ul>
      <p>
        Vous allez ainsi comparer les impacts de votre projet{" "}
        <strong>«&nbsp;{projectName}&nbsp;»</strong> sur le site «&nbsp;{baseSiteData.name}&nbsp;»
        avec le même projet sur{" "}
        {(() => {
          switch (comparisonSiteData.nature) {
            case "AGRICULTURAL_OPERATION":
              return "cette exploitation agricole";
            case "FRICHE":
              return "cette friche";
            case "NATURAL_AREA":
              return "cet espace naturel";
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
          }
        })()}
      >
        <SiteFeaturesList
          withExpressDisclaimer={false}
          {...formatSiteDataAsFeatures(comparisonSiteData)}
        />
      </IntroModalAccordion>
    </>
  );
}
