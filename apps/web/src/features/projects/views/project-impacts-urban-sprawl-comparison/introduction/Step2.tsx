import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { SiteNature } from "shared";

import { UrbanSprawlImpactsComparisonState } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";

type Props = {
  onNextClick: () => void;
  onBackClick: () => void;
  baseSiteData: Exclude<UrbanSprawlImpactsComparisonState["baseCase"], undefined>["siteData"];
  comparisonSiteData: Exclude<UrbanSprawlImpactsComparisonState["baseCase"], undefined>["siteData"];
};

const getTextFromSiteNature = (nature: SiteNature) => {
  switch (nature) {
    case "AGRICULTURAL_OPERATION":
      return {
        projectText: `Projet sur exploitation agricole`,
        conversion: "l'exploitation agricole est reconvertie",
        statuQuo: "l’exploitation agricole reste une exploitation",
      };
    case "FRICHE":
      return {
        projectText: `Projet sur friche`,
        conversion: "la friche est reconvertie",
        statuQuo: "la friche reste une friche",
      };
    case "NATURAL_AREA":
      return {
        projectText: `Projet sur espace naturel`,
        conversion: "l'espace naturel est reconverti",
        statuQuo: "l'espace naturel reste en l'état",
      };
  }
};

export default function Step1({
  onNextClick,
  onBackClick,
  baseSiteData,
  comparisonSiteData,
}: Props) {
  return (
    <>
      <div aria-hidden="true" className="tw-text-7xl tw-mb-4">
        ⚖️{" "}
      </div>

      <h2 className="tw-font-normal tw-text-3xl">
        Vous allez comparer <strong>2 situations</strong> qui incluent chacune les{" "}
        <strong>2 sites</strong>&nbsp;:
      </h2>
      <ul>
        <li>
          D'un côté la situation «{" "}
          <strong>{getTextFromSiteNature(baseSiteData.nature).projectText}</strong> » :{" "}
          {getTextFromSiteNature(baseSiteData.nature).conversion} et{" "}
          {getTextFromSiteNature(comparisonSiteData.nature).statuQuo}
        </li>
        <li>
          D'un autre côté la situation «{" "}
          <strong>{getTextFromSiteNature(comparisonSiteData.nature).projectText}</strong> » :{" "}
          {getTextFromSiteNature(comparisonSiteData.nature).conversion} et{" "}
          {getTextFromSiteNature(baseSiteData.nature).statuQuo}
        </li>
      </ul>

      <p>Pour chaque situation, Bénéfriches additionnera les impacts des 2 sites.</p>

      <div className="tw-mt-10">
        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment="between"
          buttons={[
            {
              children: "Retour",
              priority: "secondary",
              onClick: onBackClick,
            },
            {
              priority: "primary",
              children: "Comparer les impacts",
              onClick: onNextClick,
            },
          ]}
        />
      </div>
    </>
  );
}
