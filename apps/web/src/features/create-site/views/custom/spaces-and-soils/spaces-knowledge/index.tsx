import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { spacesKnowledgeStepCompleted } from "@/features/create-site/core/steps/spaces/spaces.actions";

import { SpacesKnowledgeForm } from "./SpacesKnowledgeForm";

export default function SpacesKnowledgeFormContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SpacesKnowledgeForm
      onSubmit={(data) => {
        dispatch(spacesKnowledgeStepCompleted({ knowsSpaces: data.knowsSpaces === "yes" }));
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
      siteNature={siteNature}
    />
  );
}
