import { useMemo, useState } from "react";

import {
  ProjectDevelopmentPlanType,
  ReconversionProjectsGroupedBySite,
} from "@/features/projects/domain/projects.types";

import AboutComparisonModal from "./AboutComparisonModal";
import ScenariiGroup from "./ScenariiGroup";
import ScenariiSelectionBar from "./ScenariiSelectionBar";
import { getProjectsInfosList, getSelectionInfos, getSitesInfosList } from "./getSelectionDetails";

type Props = {
  projectsList: ReconversionProjectsGroupedBySite;
};

export type ReconversionProjectList = {
  id: string;
  name: string;
  type: ProjectDevelopmentPlanType;
  isExpressProject: boolean;
}[];

function ScenariiListContainer({ projectsList }: Props) {
  const [selectedStatuQuoScenario, setSelectedStatuQuoScenario] = useState<string | undefined>();
  const [selectedProjectScenarii, setSelectedBaseProjectScenarii] = useState<string[]>([]);

  const onChangeSelectedProject = (id: string, checked: boolean) => {
    setSelectedBaseProjectScenarii((current) => {
      return checked ? [...current, id] : current.filter((selectedId) => id !== selectedId);
    });
  };

  const onChangeSelectedSite = (value?: string) => {
    setSelectedStatuQuoScenario(value);
  };

  const siteInfosList = useMemo(() => getSitesInfosList(projectsList), [projectsList]);
  const projectsInfosList = useMemo(() => getProjectsInfosList(projectsList), [projectsList]);

  const { selectableIds, selectedIds, baseScenario, withScenario } = useMemo(
    () =>
      getSelectionInfos(
        siteInfosList,
        projectsInfosList,
        selectedProjectScenarii,
        selectedStatuQuoScenario,
      ),
    [projectsInfosList, selectedProjectScenarii, selectedStatuQuoScenario, siteInfosList],
  );

  const shouldOpenModal = selectedIds.length > 0;

  return (
    <>
      <AboutComparisonModal isOpen={shouldOpenModal} />

      {(baseScenario || withScenario) && (
        <ScenariiSelectionBar
          baseScenario={baseScenario}
          withScenario={withScenario}
          onCancel={() => {
            setSelectedBaseProjectScenarii([]);
            setSelectedStatuQuoScenario(undefined);
          }}
        />
      )}
      {projectsList.map((projectGroup) => (
        <ScenariiGroup
          {...projectGroup}
          key={projectGroup.siteId}
          selectableIds={selectableIds}
          selectedIds={selectedIds}
          onChangeSelectedProject={onChangeSelectedProject}
          onChangeSelectedSite={onChangeSelectedSite}
          isFriche={projectGroup.isFriche}
          fricheActivity={projectGroup.fricheActivity}
        />
      ))}
    </>
  );
}

export default ScenariiListContainer;
