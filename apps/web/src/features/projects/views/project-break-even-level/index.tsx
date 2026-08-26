import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";

import { evaluationPeriodUpdated } from "../../application/project-impacts/actions";
import { selectBreakEvenLevelTabDataView } from "../../application/project-impacts/selectors/projectBreakEvenLevel.selectors";
import ImpactModalDescriptionProvider from "../impact-description-modals/ImpactModalDescription";
import ProjectBreakEvenLevelTab from "./ProjectBreakEvenLevelTab";

type Props = {
  projectId: string;
};

export default function ProjectBreakEvenLevelTabContainer({ projectId }: Props) {
  const breakEvenLevelView = useAppSelector(selectBreakEvenLevelTabDataView);
  const dispatch = useAppDispatch();

  const route = useRoute() as Route<typeof routes.projectImpactsBreakEvenLevel>;

  if (!breakEvenLevelView) {
    return null;
  }

  return (
    <ImpactModalDescriptionProvider
      route={route}
      getRouteFn={routes[route.name]}
      contextData={breakEvenLevelView.contextData}
      impactsData={breakEvenLevelView.impacts}
    >
      <ProjectBreakEvenLevelTab
        projectId={projectId}
        onEvaluationPeriodChange={(evaluationPeriodInYears: number) => {
          void dispatch(evaluationPeriodUpdated(evaluationPeriodInYears));
        }}
        {...breakEvenLevelView}
      />
    </ImpactModalDescriptionProvider>
  );
}
