import { SiteNature } from "shared";

import { ProjectDevelopmentPlanType } from "@/features/projects/core/projects.types";
import DsfrDialogTitle from "@/shared/views/components/Dialog/DsfrDialogTitle";
import { getPictogramUrlForSiteNature } from "@/shared/views/siteNature";

import { getScenarioPictoUrl } from "../../../shared/scenarioType";
// oxlint-disable-next-line no-unassigned-import
import "./IntroModalSecondStepContent.css";

type Props = {
  baseSiteNature: SiteNature;
  comparisonSiteNature: SiteNature;
  projectType: ProjectDevelopmentPlanType;
};

const getTextFromSiteNature = (nature: SiteNature) => {
  switch (nature) {
    case "AGRICULTURAL_OPERATION":
      return {
        projectText: `Projet sur exploitation agricole`,
        conversion: "L'exploitation agricole est reconvertie",
        statuQuo: "l’exploitation agricole reste une exploitation",
      };
    case "FRICHE":
      return {
        projectText: `Projet sur friche`,
        conversion: "La friche est reconvertie",
        statuQuo: "la friche reste une friche",
      };
    case "NATURAL_AREA":
      return {
        projectText: `Projet sur espace naturel`,
        conversion: "L'espace naturel est reconverti",
        statuQuo: "l'espace naturel reste en l'état",
      };
    case "URBAN_ZONE":
      return {
        projectText: `Projet sur zone urbaine`,
        conversion: "La zone urbaine est reconvertie",
        statuQuo: "la zone urbaine reste en l'état",
      };
  }
};

export default function Step1({ baseSiteNature, comparisonSiteNature, projectType }: Props) {
  return (
    <>
      <DsfrDialogTitle>
        Vous allez comparer <strong className="bg-[#E4D7E5]">2 situations</strong> qui incluent
        chacune les 2 sites&nbsp;:
      </DsfrDialogTitle>
      <ul className="grid md:grid-cols-2 list-none text-center px-0 py-10">
        <li className="pb-8 md:pr-10 onboarding-divider-svg">
          <span className="flex flex-col gap-4">
            <span
              aria-hidden="true"
              className="text-5xl md:text-8xl gap-4 flex justify-center items-center"
            >
              <img
                src={getScenarioPictoUrl(projectType)}
                aria-hidden={true}
                alt=""
                width="92"
                height="92"
                className="w-20 h-20 md:w-24 md:h-24"
              />
              +
              <img
                src={getPictogramUrlForSiteNature(baseSiteNature)}
                aria-hidden={true}
                alt=""
                width="92"
                height="92"
                className="w-20 h-20 md:w-24 md:h-24"
              />
            </span>
            <strong className="text-xl">
              La situation «&nbsp;{getTextFromSiteNature(baseSiteNature).projectText}&nbsp;»
            </strong>
            {getTextFromSiteNature(baseSiteNature).conversion} et{" "}
            {getTextFromSiteNature(comparisonSiteNature).statuQuo}
          </span>
        </li>

        <li className="md:pl-10">
          <span className="flex flex-col gap-4">
            <span
              aria-hidden="true"
              className="text-5xl md:text-8xl gap-4 flex justify-center items-center"
            >
              <img
                src={getScenarioPictoUrl(projectType)}
                aria-hidden={true}
                alt=""
                width="92"
                height="92"
                className="w-20 h-20 md:w-24 md:h-24"
              />
              +
              <img
                src={getPictogramUrlForSiteNature(comparisonSiteNature)}
                aria-hidden={true}
                alt=""
                width="92"
                height="92"
                className="w-20 h-20 md:w-24 md:h-24"
              />
            </span>
            <strong className="text-xl">
              La situation «&nbsp;{getTextFromSiteNature(comparisonSiteNature).projectText}
              &nbsp;»
            </strong>
            {getTextFromSiteNature(comparisonSiteNature).conversion} et{" "}
            {getTextFromSiteNature(baseSiteNature).statuQuo}
          </span>
        </li>
      </ul>

      <p>Pour chaque situation, Bénéfriches additionnera les impacts des 2 sites.</p>
    </>
  );
}
