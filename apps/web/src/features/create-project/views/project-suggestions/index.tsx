import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { projectSuggestionsCompleted } from "../../core/actions/projectSuggestionCompleted.action";
import { selectProjectSuggestionsViewData } from "../../core/createProject.selectors";
import ProjectSuggestionsForm, { FormValues } from "./ProjectSuggestionsForm";

function ProjectSuggestionsFormContainer() {
  const dispatch = useAppDispatch();
  const { projectSuggestions } = useAppSelector(selectProjectSuggestionsViewData);

  const handleSubmit = (data: FormValues) => {
    dispatch(
      projectSuggestionsCompleted({
        selectedOption: data.selectedOption === "ignore-suggestions" ? "none" : data.selectedOption,
      }),
    );
  };

  return <ProjectSuggestionsForm projectSuggestions={projectSuggestions} onSubmit={handleSubmit} />;
}

export default ProjectSuggestionsFormContainer;
