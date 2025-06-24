import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Button from "@codegouvfr/react-dsfr/Button";
import {
  convertSquareMetersToHectares,
  getFricheActivityLabel,
  getLabelForAgriculturalOperationActivity,
  getLabelForNaturalAreaType,
} from "shared";

import { UrbanSprawlImpactsComparisonState } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import SiteFeaturesList from "@/features/site-features/views/SiteFeaturesList";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import { formatSiteDataAsFeatures } from "../formatSiteData";

type Props = {
  onNextClick: () => void;
  projectName: string;
  baseSiteData: Exclude<UrbanSprawlImpactsComparisonState["baseCase"], undefined>["siteData"];
  comparisonSiteData: Exclude<UrbanSprawlImpactsComparisonState["baseCase"], undefined>["siteData"];
};

export default function Step1({
  onNextClick,
  projectName,
  baseSiteData,
  comparisonSiteData,
}: Props) {
  return (
    <>
      <div aria-hidden="true" className="tw-text-7xl tw-mb-4">
        ⚖️{" "}
      </div>

      <h2 className="tw-font-normal tw-text-3xl">
        Vous allez comparer les impacts de votre projet «&nbsp;{projectName}&nbsp;» sur l’ancienne
        carrière Misery avec le même projet sur{" "}
        <strong>
          {(() => {
            switch (comparisonSiteData.nature) {
              case "AGRICULTURAL_OPERATION":
                return "une exploitation agricole";
              case "FRICHE":
                return "une friche";
              case "NATURAL_AREA":
                return "un espace naturel";
            }
          })()}
        </strong>
      </h2>
      <p className="tw-mb-0">
        Bénéfriches va pour cela créer{" "}
        <strong>
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
        </strong>{" "}
        ayant les caractéristiques suivantes :
      </p>
      <ul className="tw-mb-6 tw-mt-2">
        <li>
          {(() => {
            switch (comparisonSiteData.nature) {
              case "AGRICULTURAL_OPERATION":
                return `Exploitation de type « ${getLabelForAgriculturalOperationActivity(comparisonSiteData.agriculturalOperationActivity ?? "POLYCULTURE_AND_LIVESTOCK")} »`;
              case "FRICHE":
                return `Friche de type « ${getFricheActivityLabel(comparisonSiteData.fricheActivity ?? "INDUSTRY")} »`;
              case "NATURAL_AREA":
                return `Espace naturel de type ${getLabelForNaturalAreaType(comparisonSiteData.naturalAreaType ?? "PRAIRIE")}`;
            }
          })()}
        </li>
        <li>Implanté sur la même intercommunalité (Nantes Métropole)</li>
        <li>
          Ayant la même superficie que{" "}
          {(() => {
            switch (comparisonSiteData.nature) {
              case "AGRICULTURAL_OPERATION":
                return "l'exploitation agricole";
              case "FRICHE":
                return "la friche";
              case "NATURAL_AREA":
                return "l'espace naturel";
            }
          })()}{" "}
          ({formatNumberFr(convertSquareMetersToHectares(baseSiteData.surfaceArea))} ha)
        </li>
      </ul>

      <Accordion label="Caractéristiques du site détaillées">
        <SiteFeaturesList {...formatSiteDataAsFeatures(comparisonSiteData)} />
      </Accordion>

      <div className="tw-mt-10 tw-flex tw-justify-end">
        <Button priority="primary" onClick={onNextClick}>
          Suivant
        </Button>
      </div>
    </>
  );
}
