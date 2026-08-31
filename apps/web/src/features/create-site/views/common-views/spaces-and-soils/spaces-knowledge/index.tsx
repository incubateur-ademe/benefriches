import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectSiteNature } from "@/features/create-site/core/selectors/createSite.selectors";

import { SpacesKnowledgeForm } from "./SpacesKnowledgeForm";

export default function SpacesKnowledgeFormContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector(selectSiteNature);

  return (
    <SpacesKnowledgeForm
      onSubmit={(data) => {
        dispatch(
          stepCompletionRequested({
            stepId: "SPACES_KNOWLEDGE",
            answers: { knowsSpaces: data.knowsSpaces === "yes" },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
      siteNature={siteNature}
    />
  );
}
