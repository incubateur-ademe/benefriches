import ImpactsComparisonPageHeader from "./ImpactsComparisonHeader";

import { Project, ProjectSite } from "@/features/projects/domain/projects.types";

type Props = {
  baseScenario:
    | {
        type: "STATU_QUO";
        id: string;
        siteData: ProjectSite;
      }
    | {
        type: "PROJECT";
        id: string;
        projectData: Project;
        siteData: ProjectSite;
      };
  withScenario: {
    type: "PROJECT";
    id: string;
    projectData: Project;
    siteData: ProjectSite;
  };
};

const mapsProps = (baseScenario: Props["baseScenario"], withScenario: Props["withScenario"]) => {
  const isStatuQuo = baseScenario.type === "STATU_QUO";
  if (isStatuQuo) {
    return {
      isStatuQuo,
      isSameSite: true,
      withScenarioName: withScenario.projectData.name || "",
      baseScenarioName: baseScenario.siteData.isFriche ? "Site en friche" : "Site en l'état",
      baseSiteName: baseScenario.siteData.name,
    };
  }

  const isSameSite = baseScenario.siteData.id === withScenario.siteData.id;

  return {
    isStatuQuo,
    isSameSite,
    withScenarioName: withScenario.projectData.name || "",
    baseScenarioName: baseScenario.projectData.name || "",
    baseSiteName: baseScenario.siteData.name,
    withSiteName: isSameSite ? undefined : withScenario.siteData.name,
  };
};

const ImpactsComparisonPageHeaderContainer = ({ baseScenario, withScenario }: Props) => {
  return <ImpactsComparisonPageHeader {...mapsProps(baseScenario, withScenario)} />;
};

export default ImpactsComparisonPageHeaderContainer;
