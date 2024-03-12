import {
  ProjectsGroup,
  ReconversionProjectsGroupedBySite,
} from "@/features/projects/domain/projects.types";

export const getProjectsInfosList = (
  projectsList: ReconversionProjectsGroupedBySite,
): ProjectInfos[] =>
  projectsList.reduce(
    (list: ProjectInfos[], projectGroup: ProjectsGroup) => [
      ...list,
      ...projectGroup.reconversionProjects.map((project) => ({
        id: project.id,
        name: project.name,
        siteId: projectGroup.siteId,
        siteName: projectGroup.siteName,
        type: "PHOTOVOLTAIC_POWER_PLANT", // TODO : get this information from api
      })),
    ],
    [],
  );

export const getSitesInfosList = (projectsList: ReconversionProjectsGroupedBySite): SiteInfos[] =>
  projectsList.map(({ reconversionProjects, siteId, siteName }) => ({
    id: siteId,
    name: siteName,
    isFriche: true, // TODO : get this information from api
    reconversionProjectIds: reconversionProjects.map(({ id }) => id),
  }));

type SelectionInfos = {
  selectedIds: string[];
  selectableIds: string[];
  baseScenario?: {
    type: "STATU_QUO" | "PROJECT";
    id: string;
    name: string;
    siteName: string;
  };
  withScenario?: {
    id: string;
    name: string;
    siteName: string;
  };
};

type SiteInfos = { id: string; name: string; isFriche: boolean; reconversionProjectIds: string[] };
type ProjectInfos = { id: string; siteId: string; siteName: string; type: string; name: string };

export const getSelectionInfos = (
  siteInfosList: SiteInfos[],
  projectsInfosList: ProjectInfos[],
  selectedProjectScenarii: string[],
  selectedStatuQuoScenario?: string,
): SelectionInfos => {
  const baseScenarioId = selectedStatuQuoScenario ?? selectedProjectScenarii[0];
  const withScenarioId = selectedStatuQuoScenario
    ? selectedProjectScenarii[0]
    : selectedProjectScenarii[1];

  if (baseScenarioId && withScenarioId) {
    const withScenario = projectsInfosList.find(({ id }) => id === withScenarioId) as ProjectInfos;

    if (selectedStatuQuoScenario) {
      const baseScenario = siteInfosList.find(({ id }) => id === baseScenarioId) as SiteInfos;
      return {
        selectableIds: [],
        selectedIds: [baseScenarioId, withScenarioId],
        baseScenario: {
          type: "STATU_QUO",
          id: baseScenarioId,
          name: baseScenario.isFriche ? "Site en friche" : "Site en l’état",
          siteName: baseScenario.name,
        },
        withScenario: {
          id: withScenarioId,
          name: withScenario.name,
          siteName: withScenario.siteName,
        },
      };
    }

    const baseScenario = projectsInfosList.find(({ id }) => id === baseScenarioId) as ProjectInfos;

    return {
      selectableIds: [],
      selectedIds: [baseScenarioId, withScenarioId],
      baseScenario: {
        type: "PROJECT",
        id: baseScenarioId,
        name: baseScenario.name,
        siteName: baseScenario.siteName,
      },
      withScenario: {
        id: withScenarioId,
        name: withScenario.name,
        siteName: withScenario.siteName,
      },
    };
  }

  if (selectedStatuQuoScenario) {
    const baseScenario = siteInfosList.find(
      ({ id }) => id === selectedStatuQuoScenario,
    ) as SiteInfos;

    return {
      selectableIds: baseScenario.reconversionProjectIds,
      selectedIds: [selectedStatuQuoScenario],
      baseScenario: {
        type: "STATU_QUO",
        id: selectedStatuQuoScenario,
        name: baseScenario.isFriche ? "Site en friche" : "Site en l’état",
        siteName: baseScenario.name,
      },
    };
  }

  const selectedProjectId = selectedProjectScenarii[0];

  if (selectedProjectId) {
    const {
      type: projectType,
      siteId: projectSiteId,
      name,
      siteName,
    } = projectsInfosList.find(({ id }) => id === selectedProjectId) as ProjectInfos;
    const sameTypeProjects = projectsInfosList
      .filter(({ type, siteId }) => type === projectType || siteId === projectSiteId)
      .map(({ id }) => id);
    return {
      selectableIds: [projectSiteId, ...sameTypeProjects],
      selectedIds: [selectedProjectId],
      baseScenario: {
        type: "PROJECT",
        id: selectedProjectId,
        name,
        siteName,
      },
    };
  }

  return {
    selectableIds: [
      ...siteInfosList
        .filter(({ reconversionProjectIds }) => reconversionProjectIds.length > 0)
        .map(({ id }) => id),
      ...projectsInfosList.map(({ id }) => id),
    ],
    selectedIds: [],
  };
};
